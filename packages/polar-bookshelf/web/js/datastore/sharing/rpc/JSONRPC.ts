import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {UserRequest} from '../db/UserRequest';
import {CloudFunctions} from '../../firebase/CloudFunctions';

export class JSONRPC {

    /**
     * Define the list of paths that should be forwarded to the CDK deployed
     * API Gateway instead of to Google Cloud Functions
     */
    private static cdkPaths = [
        'rpc-sample'
    ];

    public static async exec<R, V>(funcOrApiPath: string, request: R): Promise<V> {

        const app = FirebaseBrowser.init();

        const user = await FirebaseBrowser.currentUserAsync();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const idToken = await user.getIdToken();

        if (this.cdkPaths.includes(funcOrApiPath)) {
            return <V>await this.executeApiGatewayRequest<R, V>({
                path: funcOrApiPath,
                request,
                idToken,
            });
        }

        const userRequest: UserRequest<R> = {
            idToken,
            request,
        };

        const endpoint = CloudFunctions.createEndpoint();

        const url = `${endpoint}/${funcOrApiPath}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userRequest)
        });

        if (response.status !== 200) {
            throw new JSONRPCError(response, "Unable to handle RPC: " + funcOrApiPath);
        }

        return <V>await response.json();

    }

    private static async executeApiGatewayRequest<R, V>(props: {
        // Path within the AWS API Gateway
        path: string;

        // The request payload
        request: R;

        // Firebase token of the current user
        idToken: string,
    }) {
        const endpoint = 'https://ql77r00mvi.execute-api.us-east-1.amazonaws.com/prod';

        const url = `${endpoint}/${props.path}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': props.idToken,
            },
            body: JSON.stringify(props.request)
        });

        if (response.status !== 200) {
            throw new JSONRPCError(response, "Unable to handle RPC to AWS endpoint: " + props.path);
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
