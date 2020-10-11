"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartInfraStack = void 0;
const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const api = require("@aws-cdk/aws-apigateway");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const aws_apigateway_lambda_1 = require("@aws-solutions-constructs/aws-apigateway-lambda");
const aws_lambda_dynamodb_1 = require("@aws-solutions-constructs/aws-lambda-dynamodb");
class SmartInfraStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        // hello function responding to http requests 
        const helloFunc = new lambda.Function(this, 'HelloHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'hello.handler'
        });
        // hit counter, aws-lambda-dynamodb pattern
        const lambda_ddb_props = {
            lambdaFunctionProps: {
                code: lambda.Code.asset(`lambda`),
                runtime: lambda.Runtime.NODEJS_12_X,
                handler: 'hitcounter.handler',
                environment: {
                    DOWNSTREAM_FUNCTION_NAME: helloFunc.functionName
                }
            },
            dynamoTableProps: {
                tableName: 'Hits',
                partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING }
            }
        };
        const hitcounter = new aws_lambda_dynamodb_1.LambdaToDynamoDB(this, 'LambdaToDynamoDB', lambda_ddb_props);
        // grant the hitcounter lambda role invoke permissions to the hello function
        helloFunc.grantInvoke(hitcounter.lambdaFunction);
        const api_lambda_props = {
            existingLambdaObj: hitcounter.lambdaFunction,
            apiGatewayProps: {
                defaultMethodOptions: {
                    authorizationType: api.AuthorizationType.NONE
                }
            }
        };
        new aws_apigateway_lambda_1.ApiGatewayToLambda(this, 'ApiGatewayToLambda', api_lambda_props);
    }
}
exports.SmartInfraStack = SmartInfraStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtaW5mcmEtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzbWFydC1pbmZyYS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsOENBQThDO0FBQzlDLCtDQUErQztBQUMvQyxrREFBa0Q7QUFDbEQsMkZBQTJHO0FBQzNHLHVGQUF3RztBQUV4RyxNQUFhLGVBQWdCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDNUMsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qiw2Q0FBNkM7UUFFN0MsOENBQThDO1FBQzlDLE1BQU0sU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzFELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUNyQyxPQUFPLEVBQUUsZUFBZTtTQUN6QixDQUFDLENBQUM7UUFFSCwyQ0FBMkM7UUFDM0MsTUFBTSxnQkFBZ0IsR0FBMEI7WUFDOUMsbUJBQW1CLEVBQUU7Z0JBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7Z0JBQ2pDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7Z0JBQ25DLE9BQU8sRUFBRSxvQkFBb0I7Z0JBQzdCLFdBQVcsRUFBRTtvQkFDVCx3QkFBd0IsRUFBRSxTQUFTLENBQUMsWUFBWTtpQkFDbkQ7YUFDSjtZQUNELGdCQUFnQixFQUFFO2dCQUNkLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTthQUN0RTtTQUNGLENBQUM7UUFFRixNQUFNLFVBQVUsR0FBRyxJQUFJLHNDQUFnQixDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXBGLDRFQUE0RTtRQUM1RSxTQUFTLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVqRCxNQUFNLGdCQUFnQixHQUE0QjtZQUNoRCxpQkFBaUIsRUFBRSxVQUFVLENBQUMsY0FBYztZQUM1QyxlQUFlLEVBQUU7Z0JBQ2Ysb0JBQW9CLEVBQUU7b0JBQ3BCLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJO2lCQUM5QzthQUNGO1NBQ0YsQ0FBQztRQUVGLElBQUksMENBQWtCLENBQUMsSUFBSSxFQUFDLG9CQUFvQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDdEUsQ0FBQztDQUNGO0FBN0NELDBDQTZDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGFwaSBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tICdAYXdzLWNkay9hd3MtZHluYW1vZGInO1xuaW1wb3J0IHtBcGlHYXRld2F5VG9MYW1iZGEsQXBpR2F0ZXdheVRvTGFtYmRhUHJvcHN9IGZyb20gJ0Bhd3Mtc29sdXRpb25zLWNvbnN0cnVjdHMvYXdzLWFwaWdhdGV3YXktbGFtYmRhJztcbmltcG9ydCB7IExhbWJkYVRvRHluYW1vREIsIExhbWJkYVRvRHluYW1vREJQcm9wcyB9IGZyb20gJ0Bhd3Mtc29sdXRpb25zLWNvbnN0cnVjdHMvYXdzLWxhbWJkYS1keW5hbW9kYic7XG5cbmV4cG9ydCBjbGFzcyBTbWFydEluZnJhU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG5cbiAgICAvLyBoZWxsbyBmdW5jdGlvbiByZXNwb25kaW5nIHRvIGh0dHAgcmVxdWVzdHMgXG4gICAgY29uc3QgaGVsbG9GdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnSGVsbG9IYW5kbGVyJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYScpLFxuICAgICAgaGFuZGxlcjogJ2hlbGxvLmhhbmRsZXInXG4gICAgfSk7XG5cbiAgICAvLyBoaXQgY291bnRlciwgYXdzLWxhbWJkYS1keW5hbW9kYiBwYXR0ZXJuXG4gICAgY29uc3QgbGFtYmRhX2RkYl9wcm9wczogTGFtYmRhVG9EeW5hbW9EQlByb3BzID0ge1xuICAgICAgbGFtYmRhRnVuY3Rpb25Qcm9wczoge1xuICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmFzc2V0KGBsYW1iZGFgKSxcbiAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTJfWCxcbiAgICAgICAgICBoYW5kbGVyOiAnaGl0Y291bnRlci5oYW5kbGVyJyxcbiAgICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgICAgICBET1dOU1RSRUFNX0ZVTkNUSU9OX05BTUU6IGhlbGxvRnVuYy5mdW5jdGlvbk5hbWVcbiAgICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZHluYW1vVGFibGVQcm9wczoge1xuICAgICAgICAgIHRhYmxlTmFtZTogJ0hpdHMnLFxuICAgICAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiAncGF0aCcsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgaGl0Y291bnRlciA9IG5ldyBMYW1iZGFUb0R5bmFtb0RCKHRoaXMsICdMYW1iZGFUb0R5bmFtb0RCJywgbGFtYmRhX2RkYl9wcm9wcyk7XG5cbiAgICAvLyBncmFudCB0aGUgaGl0Y291bnRlciBsYW1iZGEgcm9sZSBpbnZva2UgcGVybWlzc2lvbnMgdG8gdGhlIGhlbGxvIGZ1bmN0aW9uXG4gICAgaGVsbG9GdW5jLmdyYW50SW52b2tlKGhpdGNvdW50ZXIubGFtYmRhRnVuY3Rpb24pO1xuXG4gICAgY29uc3QgYXBpX2xhbWJkYV9wcm9wczogQXBpR2F0ZXdheVRvTGFtYmRhUHJvcHMgPSB7XG4gICAgICBleGlzdGluZ0xhbWJkYU9iajogaGl0Y291bnRlci5sYW1iZGFGdW5jdGlvbixcbiAgICAgIGFwaUdhdGV3YXlQcm9wczoge1xuICAgICAgICBkZWZhdWx0TWV0aG9kT3B0aW9uczoge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcGkuQXV0aG9yaXphdGlvblR5cGUuTk9ORVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIG5ldyBBcGlHYXRld2F5VG9MYW1iZGEodGhpcywnQXBpR2F0ZXdheVRvTGFtYmRhJywgYXBpX2xhbWJkYV9wcm9wcyk7XG4gIH1cbn1cbiJdfQ==