import * as cdk from '@aws-cdk/core';
import {ApiGateway} from "./ApiGateway/ApiGateway";
import {ApiGatewayRoutes} from "./ApiGatewayRoutes/ApiGatewayRoutes";
import {envName} from "../bin/polar-aws-cdk-demo";
import {ElasticSearch} from './ElasticSearch/ElasticSearch';

export class PolarInfrastructure extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create the base API Gateway. Configure global stuff like CORS, default Authentication Lambda
        const apiGateway = new ApiGateway(this, 'ApiGateway', {
            description: "Polar API Gateway for environment: " + envName(),
        });

        // Define the individual API routes and attach them to the API gateway
        // eslint-disable-next-line no-new
        new ApiGatewayRoutes(this, 'Routes', {
            apiGateway: apiGateway,
        });

        // Create an ElasticSearch cluster
        new ElasticSearch(this, 'ElasticSearch');

    }
}
