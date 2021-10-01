import {Construct} from "@aws-cdk/core";
import {RestApi, TokenAuthorizer} from "@aws-cdk/aws-apigateway";
import {Billing} from "./Billing/Billing";
import {RPCSample} from "./RPCSample/RPCSample";
import * as path from "path";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";

export class ApiGatewayRoutes extends Construct {
    private customAuthorizer: TokenAuthorizer;

    constructor(scope: Construct, id: string, private props: {
        apiGateway: RestApi,
    }) {
        super(scope, id);

        // Create a Lambda authorizer that
        this.customAuthorizer = new TokenAuthorizer(this, 'FirebaseTokenAuthorizer', {
            handler: new NodejsFunction(this, 'NodejsFunction-TokenAuthorizer', {
                entry: path.resolve(__dirname, 'FirebaseTokenAuthorizer.lambda.ts'),
            })
        });

        // eslint-disable-next-line no-new
        new Billing(this, 'Billing', {
            rootResource: props
                .apiGateway
                .root
                .resourceForPath('billing'),
        })

        new RPCSample(this, 'RPCSample', {
            rootResource: props
                .apiGateway
                .root
                .resourceForPath('rpc-sample'),
        })

    }
}
