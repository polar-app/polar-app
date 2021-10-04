import {APIGatewayProxyHandler} from "aws-lambda";
import {IDUser, IDUsers} from "polar-hooks-functions/impl/util/IDUsers";
import {APIGatewayProxyResult} from "aws-lambda/trigger/api-gateway-proxy";

export interface LambdaWrapperOpts {
    /**
     * If auth is required, the Authorization header will have to have a valid Firebase JWT token
     */
    authRequired: boolean,
}

export type IRequest = unknown;

export type FuncWithAuth = (idUser: IDUser, request: IRequest) => unknown;
export type FuncWithoutAuth = (request: IRequest) => unknown;

type Middleware = (original: APIGatewayProxyResult) => APIGatewayProxyResult;

/**
 * Attach the CORS headers to every incoming object
 */
export const cors: Middleware = (response): APIGatewayProxyResult => {
    const headers = {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
    };
    return {
        ...response,
        headers,
    }
};

export const lambdaWrapper = (implementation: FuncWithAuth | FuncWithoutAuth, opts?: LambdaWrapperOpts): APIGatewayProxyHandler => {
    return async (event, context, callback) => {
        console.log('event', event);

        try {
            const request = JSON.parse(event.body || '{}');

            if (opts?.authRequired) {
                const idUser = await IDUsers.fromIDToken(event.headers['Authorization']);
                const originalImplementation = (implementation as FuncWithAuth);

                return cors({
                    statusCode: 200,
                    body: JSON.stringify(await originalImplementation(idUser, request)),
                })
            } else {
                const originalImplementation = (implementation as FuncWithoutAuth);
                return cors({
                    statusCode: 200,
                    body: JSON.stringify(await originalImplementation(request)),
                })
            }
        } catch (e) {
            // @TODO send the error to Sentry
            return cors({
                statusCode: 500,
                body: JSON.stringify({
                    error: "Internal server error",
                    stack_trace: e,
                }),
            });
        }
    }
};
