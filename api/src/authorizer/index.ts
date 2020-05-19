import { JwtAuthorizer } from "./jwt-authorizer";
import { PolicyGenerator } from "./policy-generator/policy-generator";
import { STS } from "aws-sdk";
import { AssumeRoleRequest } from "aws-sdk/clients/sts";

const JWKS_URI = `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`;
const TOKEN_ISSUER = `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.USER_POOL_ID}`;

export const authorize = async (event: any, context: any, cb: any) => {
  if (!process.env.CLIENT_ID) {
    throw new Error("env var CLIENT_ID not specified");
  }
  if (!process.env.REGION) {
    throw new Error("env var REGION not specified");
  }
  if (!process.env.USER_POOL_ID) {
    throw new Error("env var USER_POOL_ID not specified");
  }
  if (!process.env.DYNAMO_ROLE) {
    throw new Error("env var DYNAMO_ROLE not specified");
  }

  try {
    const token = event.authorizationToken.substring(7);
    const client = new JwtAuthorizer(
      TOKEN_ISSUER,
      JWKS_URI,
      process.env.CLIENT_ID
    );
    const result = await client.authorize(token);

    if (!result) {
      console.info("user is unauthorized");
      cb("Unauthorized");
      return;
    }

    //TODO: get from cognito lookup from sub instead (so we can use access_token)
    if (!result["custom:tenantId"]) {
      console.log("user has no tenantId, unauthorized");
      cb("Unauthorized");
      return;
    }
    const tenantId = result["custom:tenantId"];
    const dynamoPolicy = PolicyGenerator.generateDynamoPolicy(
      result["custom:tenantId"]
    );

    const tokenRequest: AssumeRoleRequest = {
      RoleArn: process.env.DYNAMO_ROLE,
      RoleSessionName: result.sub,
      Policy: JSON.stringify(dynamoPolicy),
      DurationSeconds: 900, // 900 is minimum
    };

    const sts = new STS();
    const dynamoToken = await sts.assumeRole(tokenRequest).promise();

    // does not support rich objects, just string values (must stringify objects)
    const authContext = {
      tenantId: tenantId,
      dynamoCredentials: JSON.stringify(dynamoToken.Credentials),
    };

    const policy = PolicyGenerator.generateApiPolicy(
      result.sub,
      "Allow",
      event.methodArn,
      authContext
    );

    cb(null, policy);
  } catch (err) {
    console.log(err);
    cb("Unauthorized");
  }
};
