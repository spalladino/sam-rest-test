import {APIGatewayEvent} from "aws-lambda";
import {CredentialsOptions} from "aws-sdk/lib/credentials";
const LocalMode = process.env.ENV === "dev"

export interface AuthenticatedUser {
    tenantId: string,
    principalId: string,
    dynamoCredentials:  CredentialsOptions | null
}

const TestUser : AuthenticatedUser = {
    tenantId: "DEFAULT_TENANT",
    principalId: "testPrincipalId",
    dynamoCredentials: null
}

export function getUser(event : APIGatewayEvent) : AuthenticatedUser {

    //TODO: is there a better way to handle this?
    if(LocalMode) {
        console.warn("Local Mode, returning test user (ENV = dev)")
        return TestUser
    }

    const authorizer = event.requestContext.authorizer
    if (!authorizer) {
        throw new Error("event.requestContext.authorizer is not set")
    }

    const credentials = JSON.parse(authorizer["dynamoCredentials"])
    const tenantId = authorizer["tenantId"]
    const principalId = authorizer["principalId"]

    return {
        tenantId: tenantId,
        principalId: principalId,
        dynamoCredentials: {
            accessKeyId: credentials["AccessKeyId"],
            secretAccessKey: credentials["SecretAccessKey"],
            sessionToken: credentials["SessionToken"],
        }
    }

}