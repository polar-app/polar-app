
import language from '@google-cloud/language'

process.env.GOOGLE_APPLICATION_CREDENTIALS="./cloud-language.json"

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
        const [result] = await client.analyzeSentiment({document});
        const sentiment = result.documentSentiment;

        if (sentiment) {
            return (result.sentences || []).map(current => current.text?.content || '');
        }

        return [];

    }

}
