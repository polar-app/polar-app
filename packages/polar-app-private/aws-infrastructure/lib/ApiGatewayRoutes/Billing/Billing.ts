import {Construct, Duration} from "@aws-cdk/core";
import {IResource, LambdaIntegration} from "@aws-cdk/aws-apigateway";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";
import {RetentionDays} from "@aws-cdk/aws-logs";

export class Billing extends Construct {

    constructor(scope: Construct, id: string, private props: {
        rootResource: IResource,
    }) {
        super(scope, id);
        this.createAppStoreNotificationEndpoint();
        this.createVerifyReceiptEndpoint();
    }

    private createAppStoreNotificationEndpoint() {
        const handler = new NodejsFunction(this, './lambdas/apple/appstore-notification.ts', {
            entry: path.resolve(__dirname, './lambdas/apple/appstore-notification.ts'),
            timeout: Duration.seconds(30),
            logRetention: RetentionDays.SIX_MONTHS,
        });
        const httpMethod = 'ANY' //'POST';
        this.props.rootResource
            .resourceForPath('apple/appstore-notification')
            .addMethod(httpMethod, new LambdaIntegration(handler));
    }

    private createVerifyReceiptEndpoint() {
        const handler = new NodejsFunction(this, './lambdas/apple/verify-receipt.ts', {
            entry: path.resolve(__dirname, './lambdas/apple/verify-receipt.ts'),
            timeout: Duration.seconds(30),
            logRetention: RetentionDays.SIX_MONTHS,
        });
        const httpMethod = 'ANY' //'POST';
        this.props.rootResource
            .resourceForPath('apple/verify-receipt')
            .addMethod(httpMethod, new LambdaIntegration(handler));
    }
}
