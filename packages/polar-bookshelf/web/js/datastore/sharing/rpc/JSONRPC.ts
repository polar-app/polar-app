import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {UserRequest} from '../db/UserRequest';
import {CloudFunctions} from '../../firebase/CloudFunctions';
import {Analytics} from "../../../analytics/Analytics";

const AwsApiGatewayURL = 'https://ql77r00mvi.execute-api.us-east-1.amazonaws.com/prod';

export class JSONRPC {

    /**
     * Define the list of paths that should be forwarded to the CDK deployed
     * API Gateway instead of to Google Cloud Functions
     */
    private static _awsLambdaFunctions = [
        'test',
        'private-beta/register',
        'private-beta/accept-users',
        'private-beta/users'
    ];

    public static async exec<R, V>(path: string, request: R): Promise<V> {

        FirebaseBrowser.init();

        const user = await FirebaseBrowser.currentUserAsync();
        const idToken = user ? await user.getIdToken() : undefined;

        if (this.isAwsLambdaFunction(path)) {
            // Proxy the function call to AWS Lambda
            return <V>await this.execWithAWS<R, V>({
                path,
                request,
                idToken,
            });
        }

        // Execute the Firebase cloud function
        return await this.execWithFirebase<R, V>({
            path,
            request,
            idToken
        });

    }

    private static async execWithFirebase<R, V>(opts: {
        // Path within the AWS API Gateway
        path: string;

        // The request payload
        request: R;

        // Firebase token of the current user
        idToken?: string,
    }) {
        if (!opts.idToken) {
            throw new Error("User not authenticated");
        }

        // TODO: we handle this differently..

        const userRequest: UserRequest<R> = {
            idToken: opts.idToken,
            request: opts.request,
        };

        const endpoint = CloudFunctions.createEndpoint();

        const url = `${endpoint}/${opts.path}/`;

        const response = await fetch(url, {
            method: 'POST',
            // credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userRequest)
        });

        Analytics.event2("CloudFunctionCalled", {name: opts.path});

        if (response.status !== 200) {
            throw new JSONRPCError(response, "Unable to handle RPC: " + opts.path);
        }

        return <V>await response.json();
    }

    private static isAwsLambdaFunction(functionName: string) {
        return this._awsLambdaFunctions.includes(functionName);
    }

    /**
     * Execute the request at AWS Lambda
     * @param opts
     * @private
     */
    private static async execWithAWS<R, V>(opts: {
        // Path within the AWS API Gateway
        path: string;

        // The request payload
        request: R;

        // Firebase token of the current user
        idToken?: string,
    }) {
        const url = `${AwsApiGatewayURL}/rpc/${opts.path}`;

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        if (opts.idToken) {
            headers.append('Authorization', opts.idToken);
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(opts.request)
        });

        Analytics.event2("CloudFunctionCalled", {name: opts.path});

        if (response.status !== 200) {
            console.error(response);
            throw new JSONRPCError(response, `Unable to handle RPC to AWS endpoint: ${opts.path}`);
        }

        return <V>await response.json();
    }
}

export class JSONRPCError extends Error {

    constructor(public readonly response: Response,
                message: string) {

        super(message);

    }

}
