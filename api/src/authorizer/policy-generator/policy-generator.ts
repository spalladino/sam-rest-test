

export class PolicyGenerator {
    static generateApiPolicy(principalId: string, effect: string, resource: string, context?: any) : any {
        let prefix = resource.split("/")[0];
        var authResponse: any = {};

        authResponse.principalId = principalId;
        if (effect && resource) {
            var policyDocument: any = {};
            policyDocument.Version = '2012-10-17';
            policyDocument.Statement = [];
            var statementOne: any = {};
            statementOne.Action = 'execute-api:Invoke';
            statementOne.Effect = effect;
            statementOne.Resource = `${prefix}/*/*/*`;
            policyDocument.Statement[0] = statementOne;
            authResponse.policyDocument = policyDocument;
        }

        if (context) {
            authResponse.context = context;
        }

        return authResponse;
    }

    static generateDynamoPolicy(tenantId: string) : any {
        return {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "AllowAccessToOnlyItemsMatchingTenantID",
                    "Effect": "Allow",
                    "Action": [
                        "dynamodb:GetItem",
                        "dynamodb:BatchGetItem",
                        "dynamodb:Query",
                        "dynamodb:PutItem",
                        "dynamodb:UpdateItem",
                        "dynamodb:DeleteItem",
                        "dynamodb:BatchWriteItem"
                    ],
                    "Resource": [
                        "*"
                    ],
                    "Condition": {
                        "ForAllValues:StringEquals": {
                            "dynamodb:LeadingKeys": [
                                tenantId
                            ]
                        }
                    }
                }
            ]
        }
    }
}