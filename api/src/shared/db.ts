import {DynamoDB} from 'aws-sdk';
import {CredentialsOptions} from "aws-sdk/lib/credentials";

export const TableName = process.env.TABLE_NAME!;
const DynamoEndpoint = process.env.DYNAMO_ENDPOINT;
const DynamoOptions = {} as { endpoint?: string };
if (DynamoEndpoint) DynamoOptions.endpoint = DynamoEndpoint;

export function getDBWithCredentials(credentials: CredentialsOptions | null) {
  if(!credentials) {
    console.warn("no credentials on request (local development)")
    return new DynamoDB.DocumentClient(DynamoOptions)
  }
  const options:DynamoDB.Types.ClientConfiguration= {
    credentials: credentials
  }
  if(DynamoEndpoint) {
    options.endpoint = DynamoEndpoint
  }
  return new DynamoDB.DocumentClient(options)
}