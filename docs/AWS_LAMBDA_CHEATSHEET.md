# AWS Lambdas as a way to run Cloud Functions

### Define a new AWS Lambda-based Cloud  Function

1. Pick a unique "path" for your lambda that follows this pattern "submodule/feature", e.g. "notes/create".
2. Define that name in the `packages/polar-bookshelf/web/js/datastore/sharing/rpc/JSONRPC.ts -> _awsLambdaFunctions`
   array.
3. Define the Lambda in the IaC (infrastructure as Code) part inside the AWS CDK
   project: `packages/polar-cdk/lib/ApiGatewayRoutes/RPC/RPC.ts - lambdas[]`. Here you need to define the same name for
   the Lambda, as well as an absolute path to where the Lambda "handler" code is located. We'll create this handled in
   the next step.
4. Create a handler for this Lambda, using instructions from the next section.

### Structure of a Lambda handler

Every Lambda handler is composed of code, structured like this:

```typescript
const actualHandler = async (request: IRequest): Promise<IResponse> => {

}
export const handler = lambdaWrapper<IRequest, IResponse>(
    actualHandler, {
        authRequired: false,
    }
);
```

The `actualHandler` is the piece of logic that should be "cloud-agnostic", meaning that it accepts an arbitrary request
payload and returns an arbitrary response payload. This function should be heavily tested and should have no tight
coupling to the AWS Lambda service (or Firebase as a service).

The `IRequest` and `IResponse` are the types of the arbitrary request and response objects. You define these as part of
developing the Cloud Function.

The second argument to `lambdaWrapper()` is a configuration object that defines "meta attributes" of your cloud
function, like does it require a Firebase token when called. If you configure `authRequired:true`, any requests to the
cloud function that don't include the user's Firebase token will be rejected with a 403 error.

### Invoking an AWS Lambda function from the frontend

```typescript
const request: IRequest = {};

const result: IResponse = await JSONRPC.exec<IRequest, IResponse>('notes/create', request);

// Do something with the result
```
