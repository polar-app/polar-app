export class JSONRPC {

    public static endpoint = "https://us-central1-polar-test2.cloudfunctions.net";

    public static async exec<R>(func: string, request: R) {

        const url = `${this.endpoint}/${func}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)});

        if (response.status !== 200) {
            throw new Error("Unable to handle RPC");
        }

    }

}
