
import language from '@google-cloud/language'

process.env.GOOGLE_APPLICATION_CREDENTIALS="./cloud-language.json"

/**
 * @deprecated use GCPSentenceSplitter
 */
export namespace SentenceSplitter {

    export async function split(text: string): Promise<ReadonlyArray<string>> {
        // Imports the Google Cloud client library

        // Instantiates a client
        const client = new language.LanguageServiceClient();

        const document: any = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        // Detects the sentiment of the text

        // FIXME: don't call analyzeSentiment - we just need to split and don't
        // care about sentiment

        const [result] = await client.analyzeSentiment({document});
        const sentiment = result.documentSentiment;

        if (sentiment) {
            return (result.sentences || []).map(current => current.text?.content || '');
        }

        return [];

    }

}
