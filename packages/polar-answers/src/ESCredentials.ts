

export namespace ESCredentials {

    export interface IESCredentials {
        readonly user: string;
        readonly pass: string;
        readonly endpoint: string;
    }

    export function get(): IESCredentials {

        const user = process.env.ES_USER;
        const pass = process.env.ES_PASS;
        const endpoint = process.env.ES_ENDPOINT;

        if (! user || ! pass || ! endpoint) {
            throw new Error("Must define ES_USER, ES_PASS, and ES_ENDPOINT");
        }

        return {user, pass, endpoint}

    }

}
