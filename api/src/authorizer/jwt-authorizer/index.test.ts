/**
 * @jest-environment node
 */

import {JwtAuthorizer} from "./index";
import createJWKSMock from "mock-jwks";
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";


describe("jwt-authorizer", function () {

    const certificateHost = "https://test.openzeppelin.com/"
    const suffix = ".well-known/jwks.json"
    const jwks = createJWKSMock(certificateHost);

    beforeEach(() => {
        jwks.start();
    });

    afterEach(() => {
        jwks.stop();
    });

    it("should authorize valid token", async function () {
        const testToken = {
            issuer: "issuer",
            aud: "audience",
            "custom:tenantId": "tenantId"
        }

        const token = jwks.token(testToken);
        const client = new JwtAuthorizer("issuer", `${certificateHost}${suffix}`, "audience");
        const res = await client.authorize(token)

        expect(res).toStrictEqual(testToken)
    });

    it("should reject expired token", async function () {
        expect.assertions(1);
        const testToken = {
            issuer: "issuer",
            aud: "audience",
            "custom:tenantId": "tenantId",
            exp: 0,
        }

        const token = jwks.token(testToken);
        const client = new JwtAuthorizer("issuer", "https://test.openzeppelin.com/.well-known/jwks.json", "audience");

        try {
            await client.authorize(token)
        } catch (err) {
            expect(err).toEqual(new TokenExpiredError("jwt expired", new Date(0)))
        }
    });

    it("should reject bad audience token", async function () {
        expect.assertions(1);
        const testToken = {
            issuer: "issuer",
            aud: "bad-audience",
            "custom:tenantId": "tenantId",
        }

        const token = jwks.token(testToken);
        const client = new JwtAuthorizer("issuer", "https://test.openzeppelin.com/.well-known/jwks.json", "audience");

        try {
            await client.authorize(token)
        } catch (err) {
            expect(err).toEqual(new JsonWebTokenError("jwt audience invalid. expected: audience",))
        }
    });

})