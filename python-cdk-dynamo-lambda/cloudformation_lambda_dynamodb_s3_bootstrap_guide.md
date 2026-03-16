
# DynamoDB Stream → Lambda → Cross Account S3 Bootstrap (CloudFormation Guide)

This guide explains how to deploy a Python AWS Lambda using **AWS CloudFormation** that:

1. Listens to DynamoDB Stream events
2. Detects accounts with `status = ACTIVE`
3. Assumes a role in AccountB
4. Creates S3 folder prefixes for the account

---

# Architecture

DynamoDB Stream (AccountA)
        │
        ▼
Lambda (AccountA)
        │
        ▼
STS AssumeRole
        │
        ▼
S3 Bucket (AccountB)

Folders Created:

accountId/
accountId/sre/
accountId/finops/
accountId/security/
accountId/gov/

---

# Step 1 — Create Lambda Code

Create a folder:

lambda/

Create file:

lambda/lambda_func.py

Paste your Lambda code inside.

---

# Step 2 — Package Lambda

Zip the file:

cd lambda
zip lambda.zip lambda_func.py

---

# Step 3 — Upload Zip to S3

Create a deployment bucket if you do not have one:

aws s3 mb s3://cf-lambda-deployments

Upload the zip:

aws s3 cp lambda.zip s3://cf-lambda-deployments/lambda.zip

---

# Step 4 — Create CloudFormation Template

Create file:

lambda-dynamo-bootstrap.yaml

Paste the following:

AWSTemplateFormatVersion: '2010-09-09'
Description: Lambda triggered by DynamoDB Streams to create S3 prefixes

Parameters:

  LambdaExecutionRoleArn:
    Type: String
    Description: Existing IAM Role ARN for Lambda

  DynamoStreamArn:
    Type: String
    Description: DynamoDB Stream ARN

  CodeBucket:
    Type: String
    Description: S3 bucket containing lambda zip

  CodeKey:
    Type: String
    Description: Lambda zip key

Resources:

  AccountBootstrapLambda:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: accounta-dynamo-s3-bootstrap-lambda
      Runtime: python3.11
      Handler: lambda_func.lambda_handler
      Timeout: 60
      Role: !Ref LambdaExecutionRoleArn

      Code:
        S3Bucket: !Ref CodeBucket
        S3Key: !Ref CodeKey

      Environment:
        Variables:
          ACCOUNTA_DYNAMODB_TABLE: accounta_dynamo
          ACCOUNTB_ID: "asdsads"
          ACCOUNTB_CAR_ROLE: accountb_car_s3role
          ACCOUNTB_S3_BUCKET: accountb-s3-bucket
          APP_REGION: us-east-1

  DynamoStreamTrigger:
    Type: AWS::Lambda::EventSourceMapping
    Properties:
      BatchSize: 10
      StartingPosition: LATEST
      EventSourceArn: !Ref DynamoStreamArn
      FunctionName: !Ref AccountBootstrapLambda

Outputs:

  LambdaName:
    Value: !Ref AccountBootstrapLambda

---

# Step 5 — Deploy CloudFormation

Run:

aws cloudformation deploy --stack-name accounta-dynamo-s3-bootstrap --template-file lambda-dynamo-bootstrap.yaml --capabilities CAPABILITY_NAMED_IAM --parameter-overrides LambdaExecutionRoleArn=arn:aws:iam::account-a:role/vj-test-kd DynamoStreamArn=arn:aws:dynamodb:us-east-1:account-a:table/accounta_dynamo/stream/<STREAM_TIMESTAMP> CodeBucket=cf-lambda-deployments CodeKey=lambda.zip

---

# Step 6 — Verify Deployment

Check in AWS Console:

Lambda:
accounta-dynamo-s3-bootstrap-lambda

Trigger:
DynamoDB Stream → accounta_dynamo

---

# Step 7 — Test

Insert into DynamoDB:

accountId | status
123456789012 | ACTIVE

The Lambda will trigger automatically and create S3 prefixes.

---

# Manual Invocation

aws lambda invoke --function-name accounta-dynamo-s3-bootstrap-lambda output.json

---

# Required IAM Permissions

Lambda role must allow:

dynamodb:Scan
dynamodb:Query
dynamodb:GetRecords
dynamodb:GetShardIterator
dynamodb:DescribeStream
dynamodb:ListStreams
sts:AssumeRole
logs:CreateLogGroup
logs:CreateLogStream
logs:PutLogEvents

---

# Notes

• DynamoDB Streams must be enabled on the table  
• Lambda role must trust lambda.amazonaws.com  
• AccountB role must trust AccountA  

---

# Result

When a new account becomes ACTIVE in DynamoDB the following prefixes are created:

accountId/
accountId/sre/
accountId/finops/
accountId/security/
accountId/gov/
