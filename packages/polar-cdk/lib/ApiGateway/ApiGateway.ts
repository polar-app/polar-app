import {Construct} from "@aws-cdk/core";
import {Cors, RestApi, RestApiProps} from "@aws-cdk/aws-apigateway";

export class ApiGateway extends RestApi {

    constructor(scope: Construct, id: string, props: RestApiProps) {
        super(scope, id, {

            // Automatically create an OPTIONS method for every resource
            defaultCorsPreflightOptions: {
                allowHeaders: ['*'],
                allowMethods: Cors.ALL_METHODS,
                allowOrigins: [
                    "https://getpolarized.io",
                    "https://app.getpolarized.io",
                    "http://localhost:8050",
                    "https://localhost:8050",
                    "http://127.0.0.1:8050",
                    "https://127.0.0.1:8050",
                ],
                disableCache: true,
                allowCredentials: true,
            },
            ...props,
        });
    }
}
