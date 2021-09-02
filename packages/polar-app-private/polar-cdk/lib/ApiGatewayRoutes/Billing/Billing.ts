import {Construct} from "@aws-cdk/core";
import {IResource} from "@aws-cdk/aws-apigateway";
import {AppleEndpoints} from "./Apple/AppleEndpoints";
import {GoogleEndpoints} from "./Google/GoogleEndpoints";

export class Billing extends Construct {

    constructor(scope: Construct, id: string, private props: {
        rootResource: IResource,
    }) {
        super(scope, id);

        new AppleEndpoints(this, 'AppleEndpoints', {
            rootResource: props.rootResource,
        });

        new GoogleEndpoints(this, 'GoogleEndpoints', {
            rootResource: props.rootResource,
        });
    }
}
