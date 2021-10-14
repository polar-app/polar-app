import {CompleteSentenceFilters} from "./CompleteSentenceFilters";
import {GCLAnalyzeSyntax} from "./GCLAnalyzeSyntax";

export namespace GCLSentenceSplitter {

    export interface ISplitOpts {
        readonly filterCompleteSentences?: boolean;
    }

    export async function split(text: string, opts: ISplitOpts = {}): Promise<ReadonlyArray<string>> {

        const analysis = await GCLAnalyzeSyntax.analyzeSyntax(text);

        function computeFilteredSentences() {
            return CompleteSentenceFilters.filter({
                sentences: analysis.sentences,
                tokens: analysis.tokens || []
            })
        }

        const sentences = opts.filterCompleteSentences ? computeFilteredSentences() : analysis.sentences || [];

        return sentences.map(current => current.text?.content || '');

    }

}
