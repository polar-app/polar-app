import language from '@google-cloud/language'
import {GCLCredentials} from "./GCLCredentials";
import {TextStr} from "polar-shared/src/util/Strings";

export namespace GCLAnalyzeEntities {

    export async function analyzeEntities(content: TextStr) {

        GCLCredentials.init();

        const client = new language.LanguageServiceClient();

        const [response] = await client.analyzeEntities({
            document: {
                content,
                type: 'PLAIN_TEXT'
            },
            encodingType: 'UTF8'
        });

        return response;

    }

}
