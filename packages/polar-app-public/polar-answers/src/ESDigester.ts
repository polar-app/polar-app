import {ESRequests} from "./ESRequests";

export namespace ESDigester {

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

    export interface IElasticResponse<T> {
        readonly _source: T;
    }

    async function doGetExtract(id: string): Promise<IElasticResponse<IExtract>> {
        return await ESRequests.doGet(`/extract/_doc/${id}`);
    }

    export async function doIndex(id: string) {

        // get the content as text that's indexed as an attachment

        const extract = await doGetExtract(id);

        console.log(extract._source.attachment.content);

        // split it on sentences
        // index it as overlapping sentences...

    }

}
