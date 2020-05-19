import { authorize } from "./index";
import { PolicyGenerator } from "./policy-generator/policy-generator";

process.env.CLIENT_ID = "clientId";
process.env.REGION = "region";
process.env.USER_POOL_ID = "userPoolId";
process.env.DYNAMO_ROLE = "dynamoRole-dynamoRole-dynamoRole"; //has to be length 20+

const mockAuth = jest.fn();
jest.mock("./jwt-authorizer", () => {
  return {
    JwtAuthorizer: jest.fn().mockImplementation(() => {
      return {
        authorize: mockAuth,
      };
    }),
  };
});

const mockAssumeRole = jest.fn();
jest.mock("aws-sdk", () => {
  return {
    STS: jest.fn().mockImplementation(() => {
      return {
        assumeRole: () => {
          return {
            promise: mockAssumeRole,
          };
        },
      };
    }),
  };
});

describe("authorize", function () {
  beforeEach(() => {
    mockAuth.mockReset();
    mockAssumeRole.mockReset();
  });

  const creds = {
    Credentials: {
      AccessKeyId: "ak",
      SecretKey: "sk",
      SessionToken: "st",
    },
  };

  it("should authorize user", async function () {
    let event = {
      authorizationToken: "Bearer token",
      methodArn: "method:region/GET/path/to/thing",
    };

    const user = {
      sub: "sub",
      "custom:tenantId": "tenantId",
    };

    mockAuth.mockReturnValueOnce(user);
    mockAssumeRole.mockReturnValueOnce(creds);
    await authorize(event, null, (err: Error | null, policy: any) => {
      expect(policy).toStrictEqual(
        PolicyGenerator.generateApiPolicy(user.sub, "Allow", event.methodArn, {
          tenantId: user["custom:tenantId"],
          dynamoCredentials: JSON.stringify(creds.Credentials),
        })
      );
    });
    expect(mockAuth.mock.calls[0][0]).toBe("token");
  });

  it("should reject user with no tenantId", async function () {
    let event = {
      authorizationToken: "Bearer token",
      methodArn: "method:region/GET/path/to/thing",
    };
    const user = {
      sub: "sub",
    };
    mockAuth.mockReturnValueOnce(user);
    mockAssumeRole.mockReturnValueOnce(creds);
    await authorize(event, null, (err: Error | null, policy: any) => {
      expect(err).toBe("Unauthorized");
      expect(policy).toBeUndefined();
    });
    expect(mockAuth.mock.calls[0][0]).toBe("token");
  });

  it("should reject user with invalid token", async function () {
    let event = {
      authorizationToken: "Bearer token",
      methodArn: "method:region/GET/path/to/thing",
    };

    mockAuth.mockRejectedValueOnce("Unauthorized");
    mockAssumeRole.mockReturnValueOnce(creds);
    await authorize(event, null, (err: Error | null, policy: any) => {
      expect(err).toBe("Unauthorized");
      expect(policy).toBeUndefined();
    });
    expect(mockAuth.mock.calls[0][0]).toBe("token");
  });
});
