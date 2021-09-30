import {APIGatewayProxyHandler} from "aws-lambda";

// Default CORS headers, attached to every Lambda Response
const headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
};

export const lambdaWrapper = (impl: APIGatewayProxyHandler): APIGatewayProxyHandler => {
    return async (event, context, callback) => {
        try {
            const result = await impl(event, context, callback)!;
            return {
                statusCode: result.statusCode,
                body: result.body,
                headers,
            }
        } catch (e) {
            // @TODO send the error to Sentry
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: "Internal server error",
                }),
                headers,
            }
        }
    }
};
