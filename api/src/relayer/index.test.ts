import { list } from ".";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

jest.mock("../shared/db");

describe("list", function () {
  test("list returns mock data", async function () {
    const result = await list({} as APIGatewayProxyEvent, {} as Context);
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual([{ relayerId: 1, name: "foo" }]);
  });
});
