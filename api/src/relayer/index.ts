import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { TableName, getDBWithCredentials } from '../shared/db';
import { getUser } from '../shared/auth';


function makeResponse(body: object, statusCode = 200) {
  return { body: JSON.stringify(body), statusCode, headers: {
    "Access-Control-Allow-Origin": "*"
  } };
}

export async function get(event: APIGatewayEvent, context: Context) : Promise<APIGatewayProxyResult> {
  console.log(`GET EVENT = ${JSON.stringify(event)}`);
  const user = getUser(event);
  const Dynamo = getDBWithCredentials(user.dynamoCredentials)
  try {
    const data = await Dynamo.get({ TableName, Key: {
      tenantId: user.tenantId,
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
  console.log(`LIST EVENT = ${JSON.stringify(event)}`);
  const user = getUser(event);
  const Dynamo = getDBWithCredentials(user.dynamoCredentials)
  try {
    const data = await Dynamo.query({ 
      TableName, 
      KeyConditionExpression: 'tenantId = :tid',
      ExpressionAttributeValues: { ':tid': user.tenantId }
    }).promise();
    console.log(`DYNAMO RESPONSE = ${JSON.stringify(data)}`);
    return makeResponse(data.Items || []);
  } catch (err) {
    console.log(`ERROR = ${err}`);
    return makeResponse({ error: err }, 500);
  }
}

export async function create(event: APIGatewayEvent, context: Context) : Promise<APIGatewayProxyResult> {
  console.log(`CREATE EVENT = ${JSON.stringify(event)}`);
  const user = getUser(event);
  const Dynamo = getDBWithCredentials(user.dynamoCredentials)
  try {
    const data = JSON.parse(event.body!) as any; // sorry
    const response = await Dynamo.put({ TableName, Item: {
      tenantId: user.tenantId,
      relayerId: data.relayerId,  //TODO: make a uuid
      name: data.name,
    }}).promise();
    console.log(`DYNAMO RESPONSE = ${JSON.stringify(response)}`);
    return makeResponse({});
  } catch (err) {
    console.log(`ERROR = ${err}`);
    return makeResponse({ error: err }, 500);
  }
}