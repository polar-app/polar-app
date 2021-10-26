import {Construct} from "@aws-cdk/core";
import {RestApi} from "@aws-cdk/aws-apigateway";
import {Billing} from "./Billing/Billing";
import {RPC} from "./RPC/RPC";

export class ApiGatewayRoutes extends Construct {

    constructor(scope: Construct, id: string, private readonly props: {
        readonly apiGateway: RestApi,
    }) {
        super(scope, id);

        // eslint-disable-next-line no-new
        new Billing(this, 'Billing', {
            rootResource: props
                .apiGateway
                .root
                .resourceForPath('billing'),
        })

        new RPC(this, 'RPC', {
            rootResource: props
                .apiGateway
                .root
                .resourceForPath('rpc'),
        });

    }
}
