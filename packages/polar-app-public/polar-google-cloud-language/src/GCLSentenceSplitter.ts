
import path from 'path';
import language from '@google-cloud/language'

function computeCredentials() {
    const resolvedPackagePath = require.resolve('polar-google-cloud-language/packages.json');
    const resolvedPackageDir = path.dirname(resolvedPackagePath);

    return path.join(resolvedPackageDir, '/cloud-language.json');
}

process.env.GOOGLE_APPLICATION_CREDENTIALS=computeCredentials();

export namespace GCLSentenceSplitter {

    export async function split(text: string): Promise<ReadonlyArray<string>> {
        // Imports the Google Cloud client library

        // Instantiates a client
        const client = new language.LanguageServiceClient();

        const document: any = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        // TODO: don't call analyzeSentiment - we just need to split and don't
        // care about sentiment at all.

        const [result] = await client.analyzeSentiment({document});
        const sentiment = result.documentSentiment;

        if (sentiment) {
            return (result.sentences || []).map(current => current.text?.content || '');
        }

        return [];

    }

}
