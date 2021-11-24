import {IResource, LambdaIntegration} from "@aws-cdk/aws-apigateway";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import {Construct, Duration} from "@aws-cdk/core";
import * as path from "path";

const lambdas: AWSLambda[] = [
    {
        name: 'test',
        path: path.resolve(__dirname, 'lambdas/test.ts'),
    },
    {
        name: 'private-beta/register',
        path: path.resolve(__dirname, 'lambdas/private-beta/register.ts'),
    },
    {
        name: 'private-beta/users',
        path: path.resolve(__dirname, 'lambdas/private-beta/users.ts'),
    },
    {
        name: 'private-beta/accept-users',
        path: path.resolve(__dirname, 'lambdas/private-beta/accept-users.ts'),
    },
];

export class RPC extends Construct {

    constructor(context: Construct, id: string, props: RPCProps) {
        super(context, id);

        lambdas.forEach(lambda => {
            const nodejsFunction = new NodejsFunction(this, lambda.name, {
                entry: lambda.path,
                timeout: Duration.seconds(lambda.timeoutSeconds ?? 30),
            });

            props.rootResource
                .resourceForPath(lambda.name)
                .addMethod('POST', new LambdaIntegration(nodejsFunction));
        });
    }
}

type AWSLambda = {
    name: string,
    path: string,
    timeoutSeconds?: number,
}

type RPCProps = {
    rootResource: IResource,
}
