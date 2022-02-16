import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {UserRequest} from '../db/UserRequest';
import {CloudFunctions} from '../../firebase/CloudFunctions';
import {Analytics} from "../../../analytics/Analytics";

const AwsApiGatewayURL = 'https://ql77r00mvi.execute-api.us-east-1.amazonaws.com/prod';

export namespace JSONRPC {

    /**
     * Define the list of paths that should be forwarded to the CDK deployed
     * API Gateway instead of to Google Cloud Functions
     */
    const _awsLambdaFunctions = [
        'test',
        'private-beta/register',
        'private-beta/accept-users',
        'private-beta/users'
    ];

    function isAwsLambdaFunction(functionName: string) {
        return _awsLambdaFunctions.includes(functionName);
    }

    /**
     * Execute with authentication.
     */
    export async function exec<R, V>(path: string, request: R): Promise<V> {

        FirebaseBrowser.init();

        const user = await FirebaseBrowser.currentUserAsync();
        const idToken = user ? await user.getIdToken() : undefined;

        interface IExecOpts<R> {
            // Path within the AWS API Gateway
            readonly path: string;

            // The request payload
            readonly request: R;

            // Firebase token of the current user
            readonly idToken?: string,

        }

        async function execWithFirebase<R, V>(opts: IExecOpts<R>) {

            if (!opts.idToken) {
                throw new Error("User not authenticated");
            }

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

        /**
         * Execute the request at AWS Lambda
         */
        async function execWithAWS<R, V>(opts: IExecOpts<R>) {

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

        if (isAwsLambdaFunction(path)) {
            // Proxy the function call to AWS Lambda
            return <V>await execWithAWS<R, V>({
                path,
                request,
                idToken,
            });
        }

        // Execute the Firebase cloud function
        return await execWithFirebase<R, V>({
            path,
            request,
            idToken
        });

    }


    /**
     * Execute without authentication. Used within functions that need to be
     * executed before the user logs in.
     */
    export async function execWithoutAuth<R, V>(path: string, request: R): Promise<V> {

        FirebaseBrowser.init();

        interface IExecOpts<R> {
            // Path within the AWS API Gateway
            readonly path: string;

            // The request payload
            readonly request: R;

        }

        async function execWithFirebase<R, V>(opts: IExecOpts<R>) {

            const endpoint = CloudFunctions.createEndpoint();

            const url = `${endpoint}/${opts.path}/`;

            const response = await fetch(url, {
                method: 'POST',
                // credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(opts.request)

            });

            Analytics.event2("CloudFunctionCalled", {name: opts.path});

            if (response.status !== 200) {
                throw new JSONRPCError(response, "Unable to handle RPC: " + opts.path);
            }

            return <V>await response.json();
        }

        async function execWithAWS<R, V>(opts: IExecOpts<R>) {

            const url = `${AwsApiGatewayURL}/rpc/${opts.path}`;

            const headers = new Headers();
            headers.append('Content-Type', 'application/json');

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

        if (isAwsLambdaFunction(path)) {
            // Proxy the function call to AWS Lambda
            return <V>await execWithAWS<R, V>({
                path,
                request,
            });
        }

        // Execute the Firebase cloud function
        return await execWithFirebase<R, V>({
            path,
            request,
        });

    }


}

export class JSONRPCError extends Error {

    constructor(public readonly response: Response,
                message: string) {

        super(message);

    }

}
