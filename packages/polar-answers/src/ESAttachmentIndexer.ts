import {Files} from "polar-shared/src/util/Files";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ESRequests} from "./ESRequests";

/**
 * @deprecated PDFText can now extract the content for us.
 */
export namespace ESAttachmentIndexer {

    export interface LocalPathDataReference {
        readonly type: 'path',
        readonly data: string;
    }

    export type DataReference = LocalPathDataReference;

    export interface IDocumentExtract {
        readonly id: string;
    }

    export async function doIndex(ref: DataReference): Promise<IDocumentExtract> {

        // convert to base64 (this is a hack for now and will use too much memory
        const data = await Files.readFileAsync(ref.data);

        // TODO: this has to be reworked as it will use a ton of memory and we should stream this
        const base64 = data.toString('base64');

        const id = Hashcodes.createRandomID();

        // the extract index pulls out the content via tika so that we have the content
        const index = 'extract';

        const url = `/${index}/_doc/${id}?pipeline=attachment`;

        await ESRequests.doPut(url, {
            data: base64
        })

        return {id};

    }

    export async function fetch(id: string) {

    }

}
