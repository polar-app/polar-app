import {Files} from "polar-shared/src/util/Files";
import {ESCredentials} from "./ESCredentials";
import {Fetches} from "polar-shared/src/util/Fetch";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

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
        const credentials = ESCredentials.get();

        const id = Hashcodes.createRandomID();

        // the extract index pulls out the content via tika so that we have the content
        const index = 'extract';

        const url = `${credentials.endpoint}/${index}/_doc/${id}?pipeline=attachment`;

        const authorization = Buffer.from(`${credentials.user}:${credentials.pass}`).toString('base64');

        await Fetches.fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                data: base64
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization
            }
        });

        return {id};

    }

}
