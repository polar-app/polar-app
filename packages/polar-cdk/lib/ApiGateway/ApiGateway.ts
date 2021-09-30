import {Construct} from "@aws-cdk/core";
import {RestApi, RestApiProps} from "@aws-cdk/aws-apigateway";

export class ApiGateway extends RestApi {

    constructor(scope: Construct, id: string, props: RestApiProps) {
        super(scope, id, {

            // Automatically create an OPTIONS method for every resource
            defaultCorsPreflightOptions: {
                allowHeaders: ['*'],
                allowMethods: ['*'],
                allowOrigins: ['*'],
                disableCache: true,
                allowCredentials: true,
            },
            ...props,
        });
    }
}
