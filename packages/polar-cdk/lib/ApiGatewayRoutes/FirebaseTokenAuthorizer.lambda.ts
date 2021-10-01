import {lambdaWrapper} from "../shared/lambdaWrapper";
import {APIGatewayProxyHandler} from "aws-lambda";

const lambda: APIGatewayProxyHandler = async (event) => {
    // TODO
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "TODO",
        })
    }
}
export const handler = lambdaWrapper(lambda);
