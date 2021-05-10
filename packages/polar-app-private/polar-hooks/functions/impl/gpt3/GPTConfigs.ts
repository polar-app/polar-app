import * as functions from 'firebase-functions';
import {Optional} from "polar-shared/src/util/ts/Optional";

export namespace GPTConfigs {

    export interface GPTConfig {
        readonly apikey: string;
    }

    export function getConfig(): GPTConfig {

        function getFromFirebaseConfig() {

            const config = functions.config();
            const apikey = config?.polar?.openai?.apikey;

            if (!apikey) {
                return undefined;
            }

            return {apikey}

        }

        function getFromENV(): GPTConfig | undefined  {
            const apikey = process.env.GPT_API_KEY;

            if (! apikey){
                return undefined;
            }

            return {
                apikey
            }

        }

        return Optional.first(getFromFirebaseConfig(), getFromENV())
            .getOrThrow("No config: polar.openai.apikey or environment var GPT_API_KEY")

    }

}