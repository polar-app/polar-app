import {ESRequests} from "./ESRequests";
import {SentenceSplitter} from "./SentenceSplitter";
import {ISibling, Tuples} from "polar-shared/src/util/Tuples";

export namespace ESDigester {

    import IElasticResponse = ESRequests.IElasticResponse;

    export interface IAttachment {
        readonly content_type: string;
        // FIXME this is the main content we want.
        readonly content: string;
    }

    export interface IExtract {
        // we dont care about this data
        readonly data: string;
        readonly attachment: IAttachment;
    }

    export interface IDigestDocument {
        readonly idx: number;
        readonly text: string;

    }

    async function doGetExtract(id: string): Promise<IElasticResponse<IExtract>> {
        return await ESRequests.doGet(`/extract/_doc/${id}`);
    }

    export async function doIndex(id: string) {

        // get the content as text that's indexed as an attachment

        const extract = await doGetExtract(id);

        const content = extract._source.attachment.content;
        const sentences = await SentenceSplitter.split(content);

        console.log("Found N sentences: " + sentences.length);

        const sentenceShingles = computeSentenceShingles(sentences);

        // TODO: we need to keep the following in the digest index
        //
        // - document ID
        // - the prev and next sentence shingle IDs

        // split it on sentences
        // index it as overlapping sentences...

        console.log("Writing sentence shingles...");

        for (const sentenceShingle of sentenceShingles) {

            const digestID = `${id}:${sentenceShingle.idx}`
            await ESRequests.doPut(`/answer_digest/_doc/${digestID}`, {
                idx: sentenceShingle.idx,
                text: sentenceShingle.text
            });

        }

        console.log("Writing sentence shingles...done");

    }

    export interface ISentenceShingle {
        readonly idx: number;
        readonly text: string;
    }

    function computeSentenceShingles(sentences: ReadonlyArray<string>): ReadonlyArray<ISentenceShingle> {

        const tuples = Tuples.createSiblings(sentences);

        const toShingle = (sibling: ISibling<string>, idx: number): ISentenceShingle => {
            const text = (sibling.prev !== undefined ? (sibling.prev + " ") : "") +
                         sibling.curr +
                         (sibling.next !== undefined ? (sibling.next + " ") : "");

            return {
                idx,
                text
            };

        }

        return tuples.map((current, idx) => toShingle(current, idx));

    }

}
