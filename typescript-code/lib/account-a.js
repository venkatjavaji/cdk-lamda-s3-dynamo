"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
const dynamodb = __importStar(require("aws-cdk-lib/aws-dynamodb"));
const event_sources = __importStar(require("aws-cdk-lib/aws-lambda-event-sources"));
class AccountAStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Import existing DynamoDB table
        const table = dynamodb.Table.fromTableAttributes(this, 'AccountsTable', {
            tableName: 'accounta_dynamo',
            tableStreamArn: 'arn:aws:dynamodb:us-east-1:158203518916:table/accounta_dynamo/stream/*'
        });
        // Lambda role
        const role = new iam.Role(this, 'LambdaExecutionRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
        });
        role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
        role.addToPolicy(new iam.PolicyStatement({
            actions: [
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:DescribeTable"
            ],
            resources: [
                "arn:aws:dynamodb:us-east-1:158203518916:table/accounta_dynamo"
            ]
        }));
        role.addToPolicy(new iam.PolicyStatement({
            actions: [
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:DescribeStream",
                "dynamodb:ListStreams"
            ],
            resources: [
                "arn:aws:dynamodb:us-east-1:158203518916:table/accounta_dynamo/stream/*"
            ]
        }));
        role.addToPolicy(new iam.PolicyStatement({
            actions: ["sts:AssumeRole"],
            resources: [
                "arn:aws:iam::339712835622:role/accountb_car_s3role"
            ]
        }));
        const fn = new lambda.Function(this, 'AccountBootstrapLambda', {
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: 'lambda_func.lambda_handler',
            code: lambda.Code.fromAsset('lambda'),
            role: role,
            environment: {
                ACCOUNTA_DYNAMODB_TABLE: 'accounta_dynamo',
                ACCOUNTB_ID: '339712835622',
                ACCOUNTB_CAR_ROLE: 'accountb_car_s3role',
                ACCOUNTB_S3_BUCKET: 'accountb_s3_bucket',
                APP_REGION: 'us-east-1'
            }
        });
        fn.addEventSource(new event_sources.DynamoEventSource(table, {
            startingPosition: lambda.StartingPosition.LATEST
        }));
    }
}
exports.AccountAStack = AccountAStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWNjb3VudC1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFtQztBQUVuQywrREFBaUQ7QUFDakQseURBQTJDO0FBQzNDLG1FQUFxRDtBQUNyRCxvRkFBc0U7QUFFdEUsTUFBYSxhQUFjLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFFMUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixpQ0FBaUM7UUFDakMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3RFLFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIsY0FBYyxFQUNaLHdFQUF3RTtTQUMzRSxDQUFDLENBQUM7UUFFSCxjQUFjO1FBQ2QsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUNyRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsc0JBQXNCLENBQUM7U0FDNUQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGdCQUFnQixDQUNuQixHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUN4QywwQ0FBMEMsQ0FDM0MsQ0FDRixDQUFDO1FBRUYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdkMsT0FBTyxFQUFFO2dCQUNQLGVBQWU7Z0JBQ2YsZ0JBQWdCO2dCQUNoQix3QkFBd0I7YUFDekI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsK0RBQStEO2FBQ2hFO1NBQ0YsQ0FBQyxDQUFDLENBQUM7UUFFSixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN2QyxPQUFPLEVBQUU7Z0JBQ1AscUJBQXFCO2dCQUNyQiwyQkFBMkI7Z0JBQzNCLHlCQUF5QjtnQkFDekIsc0JBQXNCO2FBQ3ZCO1lBQ0QsU0FBUyxFQUFFO2dCQUNULHdFQUF3RTthQUN6RTtTQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdkMsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7WUFDM0IsU0FBUyxFQUFFO2dCQUNULG9EQUFvRDthQUNyRDtTQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUosTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUM3RCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSw0QkFBNEI7WUFDckMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUNyQyxJQUFJLEVBQUUsSUFBSTtZQUNWLFdBQVcsRUFBRTtnQkFDWCx1QkFBdUIsRUFBRSxpQkFBaUI7Z0JBQzFDLFdBQVcsRUFBRSxjQUFjO2dCQUMzQixpQkFBaUIsRUFBRSxxQkFBcUI7Z0JBQ3hDLGtCQUFrQixFQUFFLG9CQUFvQjtnQkFDeEMsVUFBVSxFQUFFLFdBQVc7YUFDeEI7U0FDRixDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsY0FBYyxDQUNmLElBQUksYUFBYSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRTtZQUN6QyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTTtTQUNqRCxDQUFDLENBQ0gsQ0FBQztJQUVKLENBQUM7Q0FDRjtBQTFFRCxzQ0EwRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuaW1wb3J0ICogYXMgZXZlbnRfc291cmNlcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLWV2ZW50LXNvdXJjZXMnO1xuXG5leHBvcnQgY2xhc3MgQWNjb3VudEFTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gSW1wb3J0IGV4aXN0aW5nIER5bmFtb0RCIHRhYmxlXG4gICAgY29uc3QgdGFibGUgPSBkeW5hbW9kYi5UYWJsZS5mcm9tVGFibGVBdHRyaWJ1dGVzKHRoaXMsICdBY2NvdW50c1RhYmxlJywge1xuICAgICAgdGFibGVOYW1lOiAnYWNjb3VudGFfZHluYW1vJyxcbiAgICAgIHRhYmxlU3RyZWFtQXJuOlxuICAgICAgICAnYXJuOmF3czpkeW5hbW9kYjp1cy1lYXN0LTE6MTU4MjAzNTE4OTE2OnRhYmxlL2FjY291bnRhX2R5bmFtby9zdHJlYW0vKidcbiAgICB9KTtcblxuICAgIC8vIExhbWJkYSByb2xlXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnTGFtYmRhRXhlY3V0aW9uUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpXG4gICAgfSk7XG5cbiAgICByb2xlLmFkZE1hbmFnZWRQb2xpY3koXG4gICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoXG4gICAgICAgICdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJ1xuICAgICAgKVxuICAgICk7XG5cbiAgICByb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgXCJkeW5hbW9kYjpTY2FuXCIsXG4gICAgICAgIFwiZHluYW1vZGI6UXVlcnlcIixcbiAgICAgICAgXCJkeW5hbW9kYjpEZXNjcmliZVRhYmxlXCJcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgXCJhcm46YXdzOmR5bmFtb2RiOnVzLWVhc3QtMToxNTgyMDM1MTg5MTY6dGFibGUvYWNjb3VudGFfZHluYW1vXCJcbiAgICAgIF1cbiAgICB9KSk7XG5cbiAgICByb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgXCJkeW5hbW9kYjpHZXRSZWNvcmRzXCIsXG4gICAgICAgIFwiZHluYW1vZGI6R2V0U2hhcmRJdGVyYXRvclwiLFxuICAgICAgICBcImR5bmFtb2RiOkRlc2NyaWJlU3RyZWFtXCIsXG4gICAgICAgIFwiZHluYW1vZGI6TGlzdFN0cmVhbXNcIlxuICAgICAgXSxcbiAgICAgIHJlc291cmNlczogW1xuICAgICAgICBcImFybjphd3M6ZHluYW1vZGI6dXMtZWFzdC0xOjE1ODIwMzUxODkxNjp0YWJsZS9hY2NvdW50YV9keW5hbW8vc3RyZWFtLypcIlxuICAgICAgXVxuICAgIH0pKTtcblxuICAgIHJvbGUuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1wic3RzOkFzc3VtZVJvbGVcIl0sXG4gICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgXCJhcm46YXdzOmlhbTo6MzM5NzEyODM1NjIyOnJvbGUvYWNjb3VudGJfY2FyX3Mzcm9sZVwiXG4gICAgICBdXG4gICAgfSkpO1xuXG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdBY2NvdW50Qm9vdHN0cmFwTGFtYmRhJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfMTIsXG4gICAgICBoYW5kbGVyOiAnbGFtYmRhX2Z1bmMubGFtYmRhX2hhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdsYW1iZGEnKSxcbiAgICAgIHJvbGU6IHJvbGUsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBBQ0NPVU5UQV9EWU5BTU9EQl9UQUJMRTogJ2FjY291bnRhX2R5bmFtbycsXG4gICAgICAgIEFDQ09VTlRCX0lEOiAnMzM5NzEyODM1NjIyJyxcbiAgICAgICAgQUNDT1VOVEJfQ0FSX1JPTEU6ICdhY2NvdW50Yl9jYXJfczNyb2xlJyxcbiAgICAgICAgQUNDT1VOVEJfUzNfQlVDS0VUOiAnYWNjb3VudGJfczNfYnVja2V0JyxcbiAgICAgICAgQVBQX1JFR0lPTjogJ3VzLWVhc3QtMSdcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGZuLmFkZEV2ZW50U291cmNlKFxuICAgICAgbmV3IGV2ZW50X3NvdXJjZXMuRHluYW1vRXZlbnRTb3VyY2UodGFibGUsIHtcbiAgICAgICAgc3RhcnRpbmdQb3NpdGlvbjogbGFtYmRhLlN0YXJ0aW5nUG9zaXRpb24uTEFURVNUXG4gICAgICB9KVxuICAgICk7XG5cbiAgfVxufSJdfQ==