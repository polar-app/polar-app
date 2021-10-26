import {Construct, Duration} from "@aws-cdk/core";
import {IResource, LambdaIntegration} from "@aws-cdk/aws-apigateway";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";
import {RetentionDays} from "@aws-cdk/aws-logs";

export class GoogleEndpoints extends Construct {

    constructor(scope: Construct, id: string, private readonly props: {
        readonly rootResource: IResource,
    }) {
        super(scope, id);

        this.createVerifyReceiptEndpoint();
        this.createRtdnEndpoint();
    }

    // Create Real-Time Developer Notification endpoint which I also subscribed
    // to a Google Cloud Pub/Sub topic, which in turn is registered in the Google Play console:
    // @see https://play.google.com/console/u/0/developers/7756488128869215206/app/4974994442664840134/monetization-setup
    private createRtdnEndpoint() {
        const lambda = new NodejsFunction(this, './lambdas/rtdn.ts', {
            entry: path.resolve(__dirname, './lambdas/rtdn.ts'),
            description: 'POST /billing/google/real-time-developer-notifications',
            timeout: Duration.seconds(30),
            logRetention: RetentionDays.SIX_MONTHS,
        })
        this.props.rootResource
            .resourceForPath('google/real-time-developer-notifications')
            .addMethod('ANY', new LambdaIntegration(lambda));
    }

    private createVerifyReceiptEndpoint() {
        const lambda = new NodejsFunction(this, './lambdas/verify-receipt.ts', {
            entry: path.resolve(__dirname, './lambdas/verify-receipt.ts'),
            description: 'POST /billing/google/verify-receipt',
            timeout: Duration.seconds(30),
            logRetention: RetentionDays.SIX_MONTHS,
        })
        this.props.rootResource
            .resourceForPath('google/verify-receipt')
            .addMethod('ANY', new LambdaIntegration(lambda));
    }
}
