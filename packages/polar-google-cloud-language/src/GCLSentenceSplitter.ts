import language from '@google-cloud/language'
import {GCLCredentials} from "./GCLCredentials";

export namespace GCLSentenceSplitter {

    // TODO: We can use analyzeSyntax here instead of sentiment.
    export async function split(text: string): Promise<ReadonlyArray<string>> {
        // Imports the Google Cloud client library

        GCLCredentials.init();

        // Instantiates a client
        const client = new language.LanguageServiceClient();

        const document: any = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        // TODO: don't call analyzeSentiment - we just need to split and don't
        // care about sentiment at all.

        const [result] = await client.analyzeSyntax({document});

        return (result.sentences || []).map(current => current.text?.content || '');

    }

}
