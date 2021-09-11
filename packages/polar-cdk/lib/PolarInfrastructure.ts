import * as cdk from '@aws-cdk/core';
import {ApiGateway} from "./ApiGateway/ApiGateway";
import {ApiGatewayRoutes} from "./ApiGatewayRoutes/ApiGatewayRoutes";
import {envName} from "../bin/polar-aws-cdk-demo";

export class PolarInfrastructure extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create the base API Gateway. Configure global stuff like CORS, default Authentication Lambda,
        const apiGateway = new ApiGateway(this, 'ApiGateway', {
            description: "Polar API Gateway for environment: " + envName(),
        });

        new ApiGatewayRoutes(this, 'Routes', {
            apiGateway: apiGateway,
        })

    }
}
