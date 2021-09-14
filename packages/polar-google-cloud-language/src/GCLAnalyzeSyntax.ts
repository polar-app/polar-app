import language from '@google-cloud/language'
import {GCLCredentials} from "./GCLCredentials";
import {TextStr} from "polar-shared/src/util/Strings";

export namespace GCLAnalyzeSyntax {

    export async function analyzeSyntax(content: TextStr) {

        GCLCredentials.init();

        const client = new language.LanguageServiceClient();

        return await client.analyzeSyntax({
            document: {
                content,
                type: 'PLAIN_TEXT'
            },
            encodingType: 'UTF8'
        });

    }

    export async function extractPOS(content: string) {
        const syntax = await analyzeSyntax(content);
        // syntax.tokens
    }

}
