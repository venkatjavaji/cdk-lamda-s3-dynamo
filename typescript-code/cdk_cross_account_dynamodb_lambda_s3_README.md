
# Cross‑Account DynamoDB → Lambda → S3 Automation using AWS CDK

This project provisions infrastructure using AWS CDK to automate the following workflow:

AccountA
- Existing DynamoDB table stores account records.
- DynamoDB Stream triggers a Lambda function when records are inserted/updated.
- Lambda checks if `status = ACTIVE`.
- Lambda assumes a role in AccountB.

AccountB
- A cross‑account IAM role allows AccountA Lambda to assume it.
- Lambda creates an S3 bucket (if needed).
- Lambda creates folder structure for the account.

Example folder structure created in AccountB:

accountb-s3-bucket
 ├── 123456789012/
 │     └── rfc/
 │          └── check/

--------------------------------------------------

ARCHITECTURE

AccountA
DynamoDB (accounta_dynamo)
       │
       │ DynamoDB Stream
       ▼
Lambda (accounta-dynamo-s3-bootstrap-lambda)
       │
       │ STS AssumeRole
       ▼

AccountB
IAM Role (accountb_car_s3role)
       │
       ▼
S3 Bucket (accountb-s3-bucket)

--------------------------------------------------

PREREQUISITES

Node.js (18 or later)

Install using NVM:

nvm install 20
nvm use 20

Verify:
node -v

--------------------------------------------------

Install AWS CDK

npm install -g aws-cdk

Verify:
cdk --version

--------------------------------------------------

AWS CLI Configuration

aws configure

Provide:
Access Key
Secret Key
Region (us-east-1)

--------------------------------------------------

MULTI ACCOUNT SETUP

Create AWS CLI profiles:

aws configure --profile accountA
aws configure --profile accountB

Verify:

aws sts get-caller-identity --profile accountA
aws sts get-caller-identity --profile accountB

--------------------------------------------------

DYNAMODB REQUIREMENTS

Table name:

accounta_dynamo

Columns:

accountId (String)
status (String)

Example:

accountId: 123456789012
status: ACTIVE

--------------------------------------------------

ENABLE DYNAMODB STREAM

Console → DynamoDB → accounta_dynamo → Exports and Streams → Enable

Stream Type:

NEW_IMAGE

Verify:

aws dynamodb describe-table --table-name accounta_dynamo --query "Table.LatestStreamArn"

Example output:

arn:aws:dynamodb:us-east-1:<ACCOUNT_ID>:table/accounta_dynamo/stream/<timestamp>

--------------------------------------------------

PROJECT STRUCTURE

lambda-s3-dynamo-iam-cdk
│
├── bin
│   └── app.ts
│
├── lib
│   ├── account-a.ts
│   └── account-b.ts
│
├── lambda
│   └── lambda_func.py
│
├── package.json
├── cdk.json
└── tsconfig.json

--------------------------------------------------

BOOTSTRAP ACCOUNTS

AccountA

cdk bootstrap aws://ACCOUNT_A/us-east-1 --profile accountA

AccountB

cdk bootstrap aws://ACCOUNT_B/us-east-1 --profile accountB

--------------------------------------------------

DEPLOYMENT ORDER

Deploy AccountB first

cdk deploy AccountBStack --profile accountB

Then deploy AccountA

cdk deploy AccountAStack --profile accountA -c dynamoStreamArn=<STREAM_ARN>

Example:

cdk deploy AccountAStack -c dynamoStreamArn=arn:aws:dynamodb:us-east-1:<ACCOUNT_ID>:table/accounta_dynamo/stream/<timestamp>

--------------------------------------------------

TESTING

Insert record into DynamoDB:

accountId = 123456789012
status = ACTIVE

Lambda will trigger automatically.

Expected result in AccountB S3:

accountb-s3-bucket
 └── 123456789012/
      └── rfc/
           └── check/

--------------------------------------------------

USEFUL CDK COMMANDS

List stacks

cdk list

Preview changes

cdk diff

Deploy stack

cdk deploy

Destroy stack

cdk destroy

--------------------------------------------------

TROUBLESHOOTING

Stream Not Found

Ensure DynamoDB streams are enabled and correct ARN is used.

LogGroup Already Exists

Delete:

/aws/lambda/accounta-dynamo-s3-bootstrap-lambda

Stack in ROLLBACK_COMPLETE

Delete stack before redeploying.

--------------------------------------------------

SUMMARY

This solution automates S3 folder creation when ACTIVE accounts are inserted into DynamoDB using:

DynamoDB Streams
Lambda
Cross-account IAM roles
AWS CDK
