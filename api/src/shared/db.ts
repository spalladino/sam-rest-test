import { DynamoDB } from 'aws-sdk';

export const TableName = process.env.TABLE_NAME!;
const DynamoEndpoint = process.env.DYNAMO_ENDPOINT;
const DynamoOptions = {} as { endpoint?: string };
if (DynamoEndpoint) DynamoOptions.endpoint = DynamoEndpoint;

export function getDB() {
  return new DynamoDB.DocumentClient(DynamoOptions);
}