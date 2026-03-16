(base) vj@MacBookPro lamda-s3-dynamo-iam-cdk % cdk bootstrap aws://339712835622/us-east-1 --profile 339712835622
[WARNING] aws-cdk-lib.aws_iam.GrantOnPrincipalOptions#scope is deprecated.
  The scope argument is currently unused.
  This API will be removed in the next major release.
 ⏳  Bootstrapping environment aws://339712835622/us-east-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.
CDKToolkit: creating CloudFormation changeset...
 ✅  Environment aws://339712835622/us-east-1 bootstrapped.
(base) vj@MacBookPro lamda-s3-dynamo-iam-cdk % cdk deploy AccountBStack --profile 339712835622                  
[WARNING] aws-cdk-lib.aws_iam.GrantOnPrincipalOptions#scope is deprecated.
  The scope argument is currently unused.
  This API will be removed in the next major release.

✨  Synthesis time: 4.13s

AccountBStack: start: Building AccountBStack Template
AccountBStack: success: Built AccountBStack Template
AccountBStack: start: Publishing AccountBStack Template (339712835622-us-east-1-5dc0d357)
AccountBStack: success: Published AccountBStack Template (339712835622-us-east-1-5dc0d357)
Stack AccountBStack
IAM Statement Changes
┌───┬───────────────────────────┬────────┬──────────────────────────────────────────────────────────────┬────────────────────────────────────┬───────────┐
│   │ Resource                  │ Effect │ Action                                                       │ Principal                          │ Condition │
├───┼───────────────────────────┼────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────┼───────────┤
│ + │ ${CrossAccountS3Role.Arn} │ Allow  │ sts:AssumeRole                                               │ AWS:arn:aws:iam::158203518916:root │           │
├───┼───────────────────────────┼────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────┼───────────┤
│ + │ *                         │ Allow  │ s3:CreateBucket                                              │ AWS:${CrossAccountS3Role}          │           │
│   │                           │        │ s3:GetBucketLocation                                         │                                    │           │
│   │                           │        │ s3:ListBucket                                                │                                    │           │
│   │                           │        │ s3:PutObject                                                 │                                    │           │
└───┴───────────────────────────┴────────┴──────────────────────────────────────────────────────────────┴────────────────────────────────────┴───────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)


"--require-approval" is enabled and stack includes security-sensitive updates: 'Do you wish to deploy these changes' (y/n) 
"--require-approval" is enabled and stack includes security-sensitive updates: 'Do you wish to deploy these changes' (y/n) y
AccountBStack: deploying... [1/1]
AccountBStack: creating CloudFormation changeset...

 ✅  AccountBStack

✨  Deployment time: 50.17s

Stack ARN:
arn:aws:cloudformation:us-east-1:339712835622:stack/AccountBStack/7d5c1da0-20be-11f1-b2ff-12423b48b197

✨  Total time: 54.3s
