import aws_cdk as cdk
from constructs import Construct

from aws_cdk import (
    aws_lambda as _lambda,
    aws_iam as iam,
    aws_dynamodb as dynamodb
)

from aws_cdk.aws_lambda_event_sources import DynamoEventSource


class PythonCdkDynamoLambdaStack(cdk.Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs):
        super().__init__(scope, construct_id, **kwargs)

        table_name = "accounta_dynamo"

        # Get DynamoDB stream ARN passed during deploy
        stream_arn = self.node.try_get_context("dynamoStreamArn")

        if not stream_arn:
            raise ValueError("Pass DynamoDB stream ARN using -c dynamoStreamArn=<STREAM_ARN>")

        # Import existing DynamoDB table
        table = dynamodb.Table.from_table_attributes(
            self,
            "ExistingDynamoTable",
            table_name=table_name,
            table_stream_arn=stream_arn
        )

        # Import existing IAM role
        lambda_role = iam.Role.from_role_arn(
            self,
            "ExistingLambdaRole",
            "arn:aws:iam::accounta-id-placeholder:role/vj-test-kd",
            mutable=False
        )

        # Create Lambda
        fn = _lambda.Function(
            self,
            "AccountBootstrapLambda",
            function_name="accounta-dynamo-s3-lambda",
            runtime=_lambda.Runtime.PYTHON_3_12,
            handler="lambda_func.lambda_handler",
            code=_lambda.Code.from_asset("lambda"),
            role=lambda_role,
            timeout=cdk.Duration.seconds(60),
            environment={
                "ACCOUNTA_DYNAMODB_TABLE": table_name,
                "ACCOUNTB_ID": "accountb-id-placeholder",
                "ACCOUNTB_CAR_ROLE": "accountb_car_s3role",
                "ACCOUNTB_S3_BUCKET": "accountb-kdvj-s3-bucket",
                "APP_REGION": "us-east-1"
            }
        )

        # Attach DynamoDB stream trigger
        fn.add_event_source(
            DynamoEventSource(
                table,
                starting_position=_lambda.StartingPosition.LATEST,
                batch_size=10,
                retry_attempts=2
            )
        )