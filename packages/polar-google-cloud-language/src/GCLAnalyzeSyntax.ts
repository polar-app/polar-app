import language from '@google-cloud/language'
import {GCLCredentials} from "./GCLCredentials";
import {TextStr} from "polar-shared/src/util/Strings";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {isPresent} from "polar-shared/src/Preconditions";

export namespace GCLAnalyzeSyntax {

    export async function analyzeSyntax(content: TextStr) {

        GCLCredentials.init();

        const client = new language.LanguageServiceClient();

        const [response] = await client.analyzeSyntax({
            document: {
                content,
                type: 'PLAIN_TEXT'
            },
            encodingType: 'UTF8'
        });

        return response;

    }

    export type PartOfSpeechTag = 'NOUN' | 'VERB';

    export interface IText {
        readonly content: string;
        readonly beginOffset: number;
    }

    export async function extractPOS(content: string, pos: PartOfSpeechTag): Promise<ReadonlyArray<IText>> {

        const analysis = await analyzeSyntax(content);

        return arrayStream((analysis.tokens || []))
            .filter(current => current.partOfSpeech?.tag === pos)
            .filter(current => isPresent(current.text) && isPresent(current.text?.content))
            .map((current): IText => {
                return {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    content: current.text!.content!,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    beginOffset: current.text!.beginOffset!
                }
            })
            .filterPresent()
            .collect();

    }

}
