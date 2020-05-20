import { list } from ".";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

jest.mock("../shared/db");

describe("list", function () {
  test("list returns mock data", async function () {
    const result = await list(
      ({
        requestContext: {
          authorizer: {
            tenantId: "test",
            dynamoCredentials: JSON.stringify({
              AccessKeyId: "access-key-id",
              SecretKey: "secret-key",
              SessionToken: "session-token",
            }),
          },
        },
      } as unknown) as APIGatewayProxyEvent,
      {} as Context
    );
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual([{ relayerId: 1, name: "foo" }]);
  });
});
