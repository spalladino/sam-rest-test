import {APIGatewayEvent, APIGatewayProxyResult, Context} from "aws-lambda";

export async function handler(event: APIGatewayEvent, context: Context) : Promise<APIGatewayProxyResult> {
  console.log(`Called relayer-api lambda handler with:\n${JSON.stringify(event)}\n${JSON.stringify(context)}`);
  return {
    'statusCode': 200,
    'body': JSON.stringify({ hello: 'world' })
  }
};