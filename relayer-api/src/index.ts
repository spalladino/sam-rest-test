import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';

const TableName = process.env.TABLE_NAME!;
const DynamoEndpoint = process.env.DYNAMO_ENDPOINT;
const DynamoOptions = {} as { endpoint?: string };
if (DynamoEndpoint) DynamoOptions.endpoint = DynamoEndpoint;
const Dynamo = new DynamoDB.DocumentClient(DynamoOptions);

function makeResponse(body: object, statusCode = 200) {
  return { body: JSON.stringify(body), statusCode, headers: {
    "Access-Control-Allow-Origin": "*"
  } };
}

function logEnv() {
  console.log(`TABLE_NAME = ${TableName}`);
  console.log(`DYNAMO = ${JSON.stringify(DynamoOptions)}`);
}

export async function get(event: APIGatewayEvent, context: Context) : Promise<APIGatewayProxyResult> {
  logEnv();
  console.log(`GET EVENT = ${JSON.stringify(event)}`);
  try {
    const data = await Dynamo.get({ TableName, Key: {
      tenantId: 'DEFAULT_TENANT',
      relayerId: event.pathParameters!.relayerId
    }}).promise();
    console.log(`DYNAMO RESPONSE = ${JSON.stringify(data)}`); 
    if (!data.Item) {
      return makeResponse({ error: 'NOT_FOUND' }, 404);
    }
    return makeResponse(data.Item);
  } catch (err) {
    console.log(`ERROR = ${err}`);
    return makeResponse({ error: err }, 500);
  }
}

export async function list(event: APIGatewayEvent, context: Context) : Promise<APIGatewayProxyResult> {
  logEnv();
  console.log(`LIST EVENT = ${JSON.stringify(event)}`);
  try {
    const data = await Dynamo.query({ 
      TableName, 
      KeyConditionExpression: 'tenantId = :tid',
      ExpressionAttributeValues: { ':tid': 'DEFAULT_TENANT' }
    }).promise();
    console.log(`DYNAMO RESPONSE = ${JSON.stringify(data)}`);
    return makeResponse(data.Items || []);
  } catch (err) {
    console.log(`ERROR = ${err}`);
    return makeResponse({ error: err }, 500);
  }
}

export async function create(event: APIGatewayEvent, context: Context) : Promise<APIGatewayProxyResult> {
  logEnv();
  console.log(`CREATE EVENT = ${JSON.stringify(event)}`);
  try {
    const data = JSON.parse(event.body!) as any; // sorry
    const response = await Dynamo.put({ TableName, Item: {
      tenantId: 'DEFAULT_TENANT',
      relayerId: data.relayerId,
      name: data.name,
    }}).promise();
    console.log(`DYNAMO RESPONSE = ${JSON.stringify(response)}`);
    return makeResponse({});
  } catch (err) {
    console.log(`ERROR = ${err}`);
    return makeResponse({ error: err }, 500);
  }
}