import { handler } from ".";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

describe('handler', function () {
  test('handler returns 200', async function () {
    const result = await handler({} as APIGatewayProxyEvent, {} as Context);
    expect(result.statusCode).toEqual(200);
  });
});