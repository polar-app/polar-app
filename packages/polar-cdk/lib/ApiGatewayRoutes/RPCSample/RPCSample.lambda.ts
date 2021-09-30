import {lambdaWrapper} from "../../shared/lambdaWrapper";
import {APIGatewayProxyHandler} from "aws-lambda";

const lambda: APIGatewayProxyHandler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            message: "Hello, world!",
        })
    }
};

export const handler = lambdaWrapper(lambda);
