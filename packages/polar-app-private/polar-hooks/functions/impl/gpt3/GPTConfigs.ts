import * as functions from 'firebase-functions';

export namespace GPTConfigs {

    export interface GPTConfig {
        readonly apikey: string;
    }

    export function getConfig(): GPTConfig {

        const config = functions.config();
        const apikey = config?.polar?.openai?.apikey;

        if (!apikey) {
            throw new Error("No config: polar.openai.apikey");
        }

        return {apikey}

    }

}