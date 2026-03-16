import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as event_sources from 'aws-cdk-lib/aws-lambda-event-sources';

export class AccountAStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const account = this.account;
    const region = this.region;

    // Pass stream ARN from cdk context
    const streamArn = this.node.tryGetContext('dynamoStreamArn');

    if (!streamArn) {
      throw new Error("Please pass DynamoDB stream ARN using --context dynamoStreamArn=<ARN>");
    }

    // Import existing DynamoDB table
    const table = dynamodb.Table.fromTableAttributes(this, 'AccountsTable', {
      tableName: 'accounta_dynamo',
      tableStreamArn: streamArn
    });

    // Lambda execution role
    const role = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    });

    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole'
      )
    );

    // DynamoDB read permissions
    role.addToPolicy(new iam.PolicyStatement({
      actions: [
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:DescribeTable"
      ],
      resources: [table.tableArn]
    }));

    // DynamoDB stream permissions
    role.addToPolicy(new iam.PolicyStatement({
      actions: [
        "dynamodb:GetRecords",
        "dynamodb:GetShardIterator",
        "dynamodb:DescribeStream",
        "dynamodb:ListStreams"
      ],
      resources: [streamArn]
    }));

    // Allow assume role into AccountB
    role.addToPolicy(new iam.PolicyStatement({
      actions: ["sts:AssumeRole"],
      resources: [
        `arn:aws:iam::$accountb_id:role/accountb_car_s3role`
      ]
    }));

    const fn = new lambda.Function(this, 'AccountBootstrapLambda', {
      functionName: 'accounta-dynamo-s3-bootstrap-lambda',
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'lambda_func.lambda_handler',
      code: lambda.Code.fromAsset('lambda'),
      role: role,
      timeout: cdk.Duration.seconds(30),
      environment: {
        ACCOUNTA_DYNAMODB_TABLE: 'accounta_dynamo',
        ACCOUNTB_ID: '$accountb_id',
        ACCOUNTB_CAR_ROLE: 'accountb_car_s3role',
        ACCOUNTB_S3_BUCKET: 'accountb-kdvj-s3-bucket',
        APP_REGION: region
      }
    });

    // DynamoDB stream trigger
    fn.addEventSource(
      new event_sources.DynamoEventSource(table, {
        startingPosition: lambda.StartingPosition.LATEST
      })
    );

  }
}