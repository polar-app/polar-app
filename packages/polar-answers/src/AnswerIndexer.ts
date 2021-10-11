import {UserIDStr} from "polar-shared/src/util/Strings";
import {ESShingleWriter} from "./ESShingleWriter";
import {IAnswerIndexerRequest} from "polar-answers-api/src/IAnswerIndexerRequest";
import {AnswerIndexStatusCollection} from "polar-firebase/src/firebase/om/AnswerIndexStatusCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {PDFShingleParser} from "./PDFShingleParser";

export namespace AnswerIndexer {

    export interface IndexOpts extends IAnswerIndexerRequest {
        readonly uid: UserIDStr;
    }

    export async function doIndex(opts: IndexOpts) {

        const {uid, docID} = opts;

        const writer = ESShingleWriter.create({uid, docID});

        const firestore = FirestoreAdmin.getInstance();

        await AnswerIndexStatusCollection.set(firestore, {
            id: docID,
            uid,
            status: 'pending',
            ver: 'v2',
            type: 'doc'
        });

        await writer.init();

        await PDFShingleParser.parse({url: opts.url, skipPages: opts.skipPages}, async event => {

            const {shingles, pageNum} = event;

            for(const shingle of shingles) {
                await writer.write({pageNum, shingle});
            }

        });

        await writer.sync();

        await AnswerIndexStatusCollection.update(firestore, {
            id: docID,
            status: 'done',
        });

    }

}

