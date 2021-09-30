import {Construct} from "@aws-cdk/core";
import {RestApi} from "@aws-cdk/aws-apigateway";
import {Billing} from "./Billing/Billing";
import {RPCSample} from "./RPCSample/RPCSample";

export class ApiGatewayRoutes extends Construct {

    constructor(scope: Construct, id: string, private props: {
        apiGateway: RestApi,
    }) {
        super(scope, id);
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
