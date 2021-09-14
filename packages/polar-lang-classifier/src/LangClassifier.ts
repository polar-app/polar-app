// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Language } = require('node-nlp');

export namespace LangClassifier {

    export interface ILangClassification {
        readonly alpha3: string;
        readonly alpha2: string;
        readonly language: string;
        readonly score: number;
    }

    /**
     * https://github.com/axa-group/nlp.js/blob/master/docs/v3/language-guesser.md
     *
     * @param text
     */
    export function classify(text: string): ReadonlyArray<ILangClassification> {
        const language = new Language();
        return language.guess(text);
    }

}
