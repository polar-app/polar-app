import {IResource, LambdaIntegration} from "@aws-cdk/aws-apigateway";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
import {Construct, Duration} from "@aws-cdk/core";
import * as path from "path";

export class RPCSample extends Construct {

    constructor(context: Construct, id: string, props: {
        rootResource: IResource,
    }) {
        super(context, id);

        const lambda = new NodejsFunction(this, 'NodejsFunction', {
            entry: path.resolve(__dirname, 'RPCSample.lambda.ts'),
            timeout: Duration.seconds(30),
        });
        props.rootResource.addMethod('POST', new LambdaIntegration(lambda));
    }
}
