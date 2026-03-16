import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';


export class AccountBStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const role = new iam.Role(this, 'CrossAccountS3Role', {
            roleName: 'accountb_car_s3role',
            assumedBy: new iam.AccountPrincipal('$accounta_id') // Account A ID
        });

        role.addToPolicy(new iam.PolicyStatement({
            actions: [
                "s3:CreateBucket",
                "s3:PutObject",
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            resources: ["*"]
        }));

    }
}
