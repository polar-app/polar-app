import { EPUBContent } from 'polar-epub/src/EPUBContent';
import { SentenceShingler } from './SentenceShingler';

export namespace EPUBShingleParser {
    export async function parse(path: string) {
        const epub = EPUBContent.parse(path);

        const shingles = [];
        
        for await (const page of epub) {
            for (let i = 0; i < page.length; i++) {

                const element = page[i];

                const shingle = await SentenceShingler.computeShinglesFromContent(element.text, { filterCompleteSentences: true});

                if (shingle.length > 0) {
                    console.log({
                        input: element.text,
                        output: shingle[0].text
                    });
                }
                
                if (i > 5) {
                    break;
                }

                shingles.push(shingle);
            }
        }
    }
}