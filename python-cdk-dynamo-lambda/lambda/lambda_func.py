import boto3
import os
import logging
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError

# -------------------------
# Logger Setup
# -------------------------
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# -------------------------
# Environment Variables
# -------------------------
TABLE_NAME = os.environ["ACCOUNTA_DYNAMODB_TABLE"]
ACCOUNTB_ID = os.environ["ACCOUNTB_ID"]
ROLE_NAME = os.environ["ACCOUNTB_CAR_ROLE"]
BUCKET_NAME = os.environ["ACCOUNTB_S3_BUCKET"]
REGION = os.environ["APP_REGION"]

# -------------------------
# AWS Clients
# -------------------------
dynamodb = boto3.resource("dynamodb")
sts = boto3.client("sts")

table = dynamodb.Table(TABLE_NAME)


# ---------------------------------------
# Get ACTIVE accounts from DynamoDB
# ---------------------------------------
def get_active_accounts():

    logger.info("Scanning DynamoDB for ACTIVE accounts")

    accounts = []

    response = table.scan(
        FilterExpression=Attr("status").eq("ACTIVE")
    )

    accounts.extend(response["Items"])

    while "LastEvaluatedKey" in response:
        response = table.scan(
            FilterExpression=Attr("status").eq("ACTIVE"),
            ExclusiveStartKey=response["LastEvaluatedKey"]
        )
        accounts.extend(response["Items"])

    account_ids = [item["accountId"] for item in accounts]

    logger.info("Active accounts found: %s", account_ids)

    return account_ids


# ---------------------------------------
# Assume role in AccountB
# ---------------------------------------
def assume_role():

    role_arn = f"arn:aws:iam::{ACCOUNTB_ID}:role/{ROLE_NAME}"

    logger.info("Assuming role into AccountB: %s", role_arn)

    response = sts.assume_role(
        RoleArn=role_arn,
        RoleSessionName="vj-kd-s3-session"
    )

    creds = response["Credentials"]

    session = boto3.Session(
        aws_access_key_id=creds["AccessKeyId"],
        aws_secret_access_key=creds["SecretAccessKey"],
        aws_session_token=creds["SessionToken"],
        region_name=REGION
    )

    return session


# ---------------------------------------
# Ensure bucket exists
# ---------------------------------------
def ensure_bucket(s3):

    try:
        s3.head_bucket(Bucket=BUCKET_NAME)
        logger.info("Bucket exists and accessible: %s", BUCKET_NAME)
        return

    except ClientError as e:

        error_code = e.response["Error"]["Code"]

        # Bucket does not exist
        if error_code in ["404", "NoSuchBucket"]:

            logger.info("Bucket does not exist. Creating bucket: %s", BUCKET_NAME)

            if REGION == "us-east-1":
                s3.create_bucket(Bucket=BUCKET_NAME)
            else:
                s3.create_bucket(
                    Bucket=BUCKET_NAME,
                    CreateBucketConfiguration={
                        "LocationConstraint": REGION
                    }
                )

            logger.info("Bucket created successfully: %s", BUCKET_NAME)

        # Bucket exists but belongs to another AWS account
        elif error_code in ["403", "AccessDenied"]:

            logger.warning(
                "Bucket exists but is not owned by this account: %s. Using existing bucket.",
                BUCKET_NAME
            )

        else:
            logger.error("Unexpected error checking bucket: %s", str(e))
            raise

# ---------------------------------------
# Create S3 paths
# ---------------------------------------
def create_paths(s3, account_id):

    prefixes = [
        f"{account_id}/",
        f"{account_id}/sre/",
        f"{account_id}/finops/",
        f"{account_id}/security/",
        f"{account_id}/gov/"
    ]

    for prefix in prefixes:

        try:

            logger.info(
                "Creating path | account=%s | key=%s",
                account_id,
                prefix
            )

            s3.put_object(
                Bucket=BUCKET_NAME,
                Key=prefix
            )

        except ClientError as e:

            logger.error(
                "Failed creating path | account=%s | error=%s",
                account_id,
                str(e)
            )


# ---------------------------------------
# Lambda Handler
# ---------------------------------------
def lambda_handler(event, context):

    logger.info("Lambda invoked with event: %s", event)

    session = assume_role()
    s3 = session.client("s3")

    ensure_bucket(s3)

    # --------------------------------------------------
    # Case 1: DynamoDB Stream Trigger
    # --------------------------------------------------
    if "Records" in event:

        logger.info("Processing DynamoDB stream event")

        for record in event["Records"]:

            if record["eventName"] not in ["INSERT", "MODIFY"]:
                continue

            new_image = record["dynamodb"]["NewImage"]

            account_id = new_image["accountId"]["S"]
            status = new_image["status"]["S"]

            if status.casefold() != "active".casefold():
                logger.info("Skipping account %s with status %s", account_id, status)
                continue

            logger.info("Creating paths for ACTIVE account: %s", account_id)

            create_paths(s3, account_id)

        return {"status": "STREAM_PROCESSED"}

    # --------------------------------------------------
    # Case 2: Manual Invocation
    # --------------------------------------------------
    else:

        logger.info("Manual invocation detected. Running full scan")

        active_accounts = get_active_accounts()

        if not active_accounts:

            logger.info("No ACTIVE accounts found")
            return {"status": "NO_ACCOUNTS"}

        for account_id in active_accounts:
            create_paths(s3, account_id)

        return {
            "status": "MANUAL_RUN_COMPLETE",
            "accounts_processed": len(active_accounts)
        }