import {Construct} from "@aws-cdk/core";
import {RestApi} from "@aws-cdk/aws-apigateway";
import {Billing} from "./Billing/Billing";

export class ApiGatewayRoutes extends Construct {

    constructor(scope: Construct, id: string, private props: {
        apiGateway: RestApi,
    }) {
        super(scope, id);

        new Billing(this, 'Billing', {
            rootResource: props.apiGateway.root
                .resourceForPath('billing'),
        })

    }
}
