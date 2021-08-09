import {Construct, Duration} from "@aws-cdk/core";
import {IResource, LambdaIntegration} from "@aws-cdk/aws-apigateway";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";
import {RetentionDays} from "@aws-cdk/aws-logs";

export class GoogleEndpoints extends Construct {

    constructor(scope: Construct, id: string, private props: {
        rootResource: IResource,
    }) {
        super(scope, id);

        this.createRTDNendpoint();
    }

    private createRTDNendpoint() {
        const lambda = new NodejsFunction(this, './lambdas/rtdn.ts', {
            entry: path.resolve(__dirname, './lambdas/rtdn.ts'),
            description: 'POST /billing/google/real-time-developer-notifications',
            timeout: Duration.seconds(30),
            logRetention: RetentionDays.SIX_MONTHS,
        })
        this.props.rootResource.resourceForPath('google/real-time-developer-notifications')
            .addMethod('ANY', new LambdaIntegration(lambda));
    }
}
