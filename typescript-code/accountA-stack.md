(base) vj@MacBookPro lamda-s3-dynamo-iam-cdk % cdk bootstrap aws://158203518916/us-east-1 --profile default
[WARNING] aws-cdk-lib.aws_iam.GrantOnPrincipalOptions#scope is deprecated.
  The scope argument is currently unused.
  This API will be removed in the next major release.
 ⏳  Bootstrapping environment aws://158203518916/us-east-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.
CDKToolkit: creating CloudFormation changeset...
[█████████▋················································] (2/12)

6:33:33 PM | CREATE_IN_PROGRESS   | AWS::CloudFormation::Stack | CDKToolkit
6:33:37 PM | CREATE_IN_PROGRESS   | AWS::IAM::Role             | ImagePublishingRole
6:33:37 PM | CREATE_IN_PROGRESS   | AWS::IAM::Role             | CloudFormationExecutionRole
6:33:37 PM | CREATE_IN_PROGRESS   | AWS::IAM::Role             | LookupRole
6:33:37 PM | CREATE_IN_PROGRESS   | AWS::IAM::Role             | FilePublishingRole
6:33:37 PM | CREATE_IN_PROGRESS   | AWS::S3::Bucket            | StagingBucket


(base) vj@MacBookPro lamda-s3-dynamo-iam-cdk % cdk deploy AccountAStack --profile default                  
[WARNING] aws-cdk-lib.aws_iam.GrantOnPrincipalOptions#scope is deprecated.
  The scope argument is currently unused.
  This API will be removed in the next major release.

✨  Synthesis time: 4.44s

AccountAStack: start: Building AccountBootstrapLambda/Code
AccountAStack: success: Built AccountBootstrapLambda/Code
AccountAStack: start: Building AccountAStack Template
AccountAStack: success: Built AccountAStack Template
AccountAStack: start: Publishing AccountAStack Template (158203518916-us-east-1-542aa1f9)
AccountAStack: start: Publishing AccountBootstrapLambda/Code (158203518916-us-east-1-f15f9152)
AccountAStack: success: Published AccountBootstrapLambda/Code (158203518916-us-east-1-f15f9152)
AccountAStack: success: Published AccountAStack Template (158203518916-us-east-1-542aa1f9)
Stack AccountAStack
IAM Statement Changes
┌───┬────────────────────────────────────────────────────────────────────────┬────────┬────────────────────────────────────────────────────────────────────────┬──────────────────────────────┬───────────┐
│   │ Resource                                                               │ Effect │ Action                                                                 │ Principal                    │ Condition │
├───┼────────────────────────────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────┼───────────┤
│ + │ ${LambdaExecutionRole.Arn}                                             │ Allow  │ sts:AssumeRole                                                         │ Service:lambda.amazonaws.com │           │
├───┼────────────────────────────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────┼───────────┤
│ + │ *                                                                      │ Allow  │ dynamodb:ListStreams                                                   │ AWS:${LambdaExecutionRole}   │           │
├───┼────────────────────────────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────┼───────────┤
│ + │ arn:aws:dynamodb:us-east-1:158203518916:table/accounta_dynamo          │ Allow  │ dynamodb:DescribeTable                                                 │ AWS:${LambdaExecutionRole}   │           │
│   │                                                                        │        │ dynamodb:Query                                                         │                              │           │
│   │                                                                        │        │ dynamodb:Scan                                                          │                              │           │
├───┼────────────────────────────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────┼───────────┤
│ + │ arn:aws:dynamodb:us-east-1:158203518916:table/accounta_dynamo/stream/* │ Allow  │ dynamodb:DescribeStream                                                │ AWS:${LambdaExecutionRole}   │           │
│   │                                                                        │        │ dynamodb:GetRecords                                                    │                              │           │
│   │                                                                        │        │ dynamodb:GetShardIterator                                              │                              │           │
│   │                                                                        │        │ dynamodb:ListStreams                                                   │                              │           │
├───┼────────────────────────────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────┼───────────┤
│ + │ arn:aws:iam::339712835622:role/accountb_car_s3role                     │ Allow  │ sts:AssumeRole                                                         │ AWS:${LambdaExecutionRole}   │           │
└───┴────────────────────────────────────────────────────────────────────────┴────────┴────────────────────────────────────────────────────────────────────────┴──────────────────────────────┴───────────┘
IAM Policy Changes
┌───┬────────────────────────┬────────────────────────────────────────────────────────────────────────────────┐
│   │ Resource               │ Managed Policy ARN                                                             │
├───┼────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${LambdaExecutionRole} │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole │
└───┴────────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)


"--require-approval" is enabled and stack includes security-sensitive updates: 'Do you wish to deploy these changes' (y/n) y
AccountAStack: deploying... [1/1]
AccountAStack: creating CloudFormation changeset...

AccountAStack: start: Building AccountAStack Template
AccountAStack: success: Built AccountAStack Template
AccountAStack: start: Publishing AccountAStack Template (158203518916-us-east-1-84aea2d3)
AccountAStack: success: Published AccountAStack Template (158203518916-us-east-1-84aea2d3)
Stack AccountAStack
IAM Statement Changes
┌───┬───────────────────────────────────┬────────┬───────────────────────────────────┬───────────────────────────────────┬───────────┐
│   │ Resource                          │ Effect │ Action                            │ Principal                         │ Condition │
├───┼───────────────────────────────────┼────────┼───────────────────────────────────┼───────────────────────────────────┼───────────┤
│ + │ ${LambdaExecutionRole.Arn}        │ Allow  │ sts:AssumeRole                    │ Service:lambda.amazonaws.com      │           │
├───┼───────────────────────────────────┼────────┼───────────────────────────────────┼───────────────────────────────────┼───────────┤
│ + │ *                                 │ Allow  │ dynamodb:ListStreams              │ AWS:${LambdaExecutionRole}        │           │
├───┼───────────────────────────────────┼────────┼───────────────────────────────────┼───────────────────────────────────┼───────────┤
│ + │ arn:aws:dynamodb:us-east-1:158203 │ Allow  │ dynamodb:DescribeTable            │ AWS:${LambdaExecutionRole}        │           │
│   │ 518916:table/accounta_dynamo      │        │ dynamodb:Query                    │                                   │           │
│   │                                   │        │ dynamodb:Scan                     │                                   │           │
├───┼───────────────────────────────────┼────────┼───────────────────────────────────┼───────────────────────────────────┼───────────┤
│ + │ arn:aws:dynamodb:us-east-1:158203 │ Allow  │ dynamodb:DescribeStream           │ AWS:${LambdaExecutionRole}        │           │
│   │ 518916:table/accounta_dynamo/stre │        │ dynamodb:GetRecords               │                                   │           │
│   │ am/2026-03-15T22:06:52.321        │        │ dynamodb:GetShardIterator         │                                   │           │
│   │                                   │        │ dynamodb:ListStreams              │                                   │           │
├───┼───────────────────────────────────┼────────┼───────────────────────────────────┼───────────────────────────────────┼───────────┤
│ + │ arn:aws:iam::339712835622:role/ac │ Allow  │ sts:AssumeRole                    │ AWS:${LambdaExecutionRole}        │           │
│   │ countb_car_s3role                 │        │                                   │                                   │           │
└───┴───────────────────────────────────┴────────┴───────────────────────────────────┴───────────────────────────────────┴───────────┘
IAM Policy Changes
┌───┬────────────────────────┬────────────────────────────────────────────────────────────────────────────────┐
│   │ Resource               │ Managed Policy ARN                                                             │
├───┼────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${LambdaExecutionRole} │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole │
└───┴────────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)


"--require-approval" is enabled and stack includes security-sensitive updates: 'Do you wish to deploy these changes' (y/n) y
AccountAStack: deploying... [1/1]
AccountAStack: creating CloudFormation changeset...

 ✅  AccountAStack

✨  Deployment time: 61.49s

Stack ARN:
arn:aws:cloudformation:us-east-1:158203518916:stack/AccountAStack/dab60e50-20c0-11f1-b7de-12b9a5d248c9

✨  Total time: 65.74s