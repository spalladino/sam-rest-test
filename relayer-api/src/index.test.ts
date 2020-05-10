import { get, create } from ".";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

describe('get', function () {
  test('get returns 200', async function () {
    const result = await get({} as APIGatewayProxyEvent, {} as Context);
    expect(result.statusCode).toEqual(200);
  });
});