# sam-rest-test

Testing a RESTful CRUD API backed by DynamoDB managed via SAM.

## Structure

- `api` contains the lambda functions that run in AWS API Gateway
- `app` contains the frontend react app
- `template.yaml` contains the sam template for the project structure in AWS

## Setup

- Install [node 12](https://nodejs.org/en/), [docker](https://docs.docker.com/get-docker/), [jq](https://github.com/stedolan/jq/wiki/Installation), [sam-cli](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) (yeah, asks for homebrew), [aws cli](https://aws.amazon.com/cli/), and optionally the [VSCode plugin](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/welcome.html)
- Run `npm install` in the package root, and inside `api` and `app`
- Run `npm run build` (or `npm run watch`) at the project root to build the `api` (output should be in `api/build`)

## Deploying to AWS

- Run `sam deploy --guided` to deploy to AWS (please remember to use the AWS development account), you'll need to re-run this every time you modify your lambda code or the content of the template
- Run `npm run dev:create-user` to create a user `sample@example.com` with password `password` in the user pool
- Run `npm run dev:export-stack` to write a local `app/src/aws.json` file with the IDs of the resources created in AWS that will be used by the react app

## Running the app

- Run `npm run start` in the `app` folder

## Running locally

- Run `npm run dev:start-db` to start a docker container with a local dynamodb
- Run `npm run dev:create-tables` to create local tables using the schema in `scripts/create-tables.sh` (ideally, this schema should be loaded from the `template.yaml` instead)
- Run `npm run dev:start-api` to start a local version of the API gateway using `sam`
- Run the app pointing to the local api with `npm run start-local` in the `app` folder

You can also try out the following requests:

```bash
# Create a relayer
curl -XPOST 'http://localhost:4000/relayers' -d '{ "relayerId": "1", "tenantId": "DEFAULT_TENANT", "name": "relayer1" }' -H "Content-Type: application/json"
# Get the relayer created
curl 'http://localhost:4000/relayers/1'
# List all relayers
curl 'http://localhost:4000/relayers'
```

## Next steps

- Find out a better way to define env variables for local testing, that don't require adding the name of each function in `api/envs/dev.json`
- Split the `template.yaml` into several templates, in order to separate the resources updated frequently (eg lambdas) and the more permanent resources (eg cognito)
- Use a custom lambda authorizer to load the tenant info, and wrap the Dynamo client in an IAM role restricted to the current tenant (see [this article](https://medium.com/@tarekbecker/serverless-enterprise-grade-multi-tenancy-using-aws-76ff5f4d0a23))
- Setup unit tests for lambdas using [jest-dynamodb](https://github.com/shelfio/jest-dynamodb) or [jest-dynalite](https://github.com/freshollie/jest-dynalite/blob/master/src/db.ts)
- Set up a CI/CD using CircleCI or Github actions
- Set up a deployment step to S3 for the built react-app
- Try out local lambda debugging
- Setup swagger for the API, or create shared typescript interfaces for client and server (and figure out what are [API Gateway Models](https://docs.aws.amazon.com/apigateway/latest/developerguide/rest-api-data-transformations.html))
