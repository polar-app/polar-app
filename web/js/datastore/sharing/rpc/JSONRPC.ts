import {Firebase} from '../../../firebase/Firebase';
import {UserRequest} from '../db/UserRequest';


export class JSONRPC {

    private static createEndpoint() {
        const project = process.env.POLAR_TEST_PROJECT || "polar-cors";
        return `https://us-central1-${project}.cloudfunctions.net`;
    }

    public static async exec<R, V>(func: string, request: R): Promise<V> {

        const app = Firebase.init();
        const user = app.auth().currentUser;

        if (! user) {
            throw new Error("User not authenticated");
        }

        const idToken = await user.getIdToken();

        const userRequest: UserRequest<R> = {
            idToken,
            request,
        };

        const endpoint = this.createEndpoint();

        const url = `${endpoint}/${func}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userRequest)});

        if (response.status !== 200) {
            throw new Error("Unable to handle RPC");
        }

        return <V> await response.json();

    }

}
