import {PolicyGenerator} from "./policy-generator";

describe("generate api policy", function () {
    test("allow", async function () {
        const policy = PolicyGenerator.generateApiPolicy("principalId", "Allow", "method-arn", {name: "value"})
        expect(policy).toStrictEqual({
            "principalId": "principalId",
            "policyDocument": {
                "Version": "2012-10-17",
                "Statement": [{"Action": "execute-api:Invoke", "Effect": "Allow", "Resource": "method-arn/*/*/*"}]
            },
            "context": {"name": "value"}
        })
    });

    test("deny", async function () {
        const policy = PolicyGenerator.generateApiPolicy("principalId", "Deny", "method-arn", {name: "value"})
        expect(policy).toStrictEqual({
            "principalId": "principalId",
            "policyDocument": {
                "Version": "2012-10-17",
                "Statement": [{"Action": "execute-api:Invoke", "Effect": "Deny", "Resource": "method-arn/*/*/*"}]
            },
            "context": {"name": "value"}
        })
    });

    test("no context", async function () {
        const policy = PolicyGenerator.generateApiPolicy("principalId", "Allow", "method-arn")
        expect(policy).toStrictEqual({
            "principalId": "principalId",
            "policyDocument": {
                "Version": "2012-10-17",
                "Statement": [{"Action": "execute-api:Invoke", "Effect": "Allow", "Resource": "method-arn/*/*/*"}]
            },
        })
    });

    test("no effect", async function () {
        const policy = PolicyGenerator.generateApiPolicy("principalId", "", "method-arn", {name: "value"})
        expect(policy).toStrictEqual({
            "principalId": "principalId",
            "context": {"name": "value"}
        })
    });

    test("no resource", async function () {
        const policy = PolicyGenerator.generateApiPolicy("principalId", "Allow", "", {name: "value"})
        expect(policy).toStrictEqual({
            "principalId": "principalId",
            "context": {"name": "value"}
        })
    });
});

describe("generate dynamo policy", function () {
    test("with tenant", async function () {
        const policy = PolicyGenerator.generateDynamoPolicy("tenantId")
        expect(policy).toStrictEqual({
            "Statement": [
                {
                    "Action": [
                        "dynamodb:GetItem",
                        "dynamodb:BatchGetItem",
                        "dynamodb:Query",
                        "dynamodb:PutItem",
                        "dynamodb:UpdateItem",
                        "dynamodb:DeleteItem",
                        "dynamodb:BatchWriteItem"
                    ],
                    "Condition": {
                        "ForAllValues:StringEquals": {
                            "dynamodb:LeadingKeys": [
                                "tenantId"
                            ]
                        }
                    },
                    "Effect": "Allow",
                    "Resource": [
                        "*"
                    ],
                    "Sid": "AllowAccessToOnlyItemsMatchingTenantID"
                }
            ],
            "Version": "2012-10-17"
        })
    });

    test("without tenant", async function () {
        const scenario = () => {
            PolicyGenerator.generateDynamoPolicy("")
        }
        expect(scenario).toThrowError(Error)
    });
})
