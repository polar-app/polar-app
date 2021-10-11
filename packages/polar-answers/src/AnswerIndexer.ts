import {UserIDStr} from "polar-shared/src/util/Strings";
import {ESShingleWriter} from "./ESShingleWriter";
import {IAnswerIndexerRequest} from "polar-answers-api/src/IAnswerIndexerRequest";
import {
    AnswerIndexStatusCollection,
} from "polar-firebase/src/firebase/om/AnswerIndexStatusCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {PDFShingleParser} from "./PDFShingleParser";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

export namespace AnswerIndexer {

    import IAnswerIndexerStatusPendingV3 = AnswerIndexStatusCollection.IAnswerIndexerStatusPendingV3;
    import IAnswerIndexerStatusDoneV3 = AnswerIndexStatusCollection.IAnswerIndexerStatusDoneV3;

    export interface IndexOpts extends IAnswerIndexerRequest {
        readonly uid: UserIDStr;
    }

    export async function doIndex(opts: IndexOpts) {

        const {uid, docID} = opts;

        const writer = ESShingleWriter.create({uid, docID});

        const firestore = FirestoreAdmin.getInstance();

        const started = ISODateTimeStrings.create();

        async function writeIndexStatusPending() {

            const record: IAnswerIndexerStatusPendingV3 = {
                id: docID,
                uid,
                status: 'pending',
                ver: 'v3',
                type: 'doc',
                started
            }

            await AnswerIndexStatusCollection.set(firestore, record);

        }

        async function writeIndexStatusDone() {

            const duration = Math.floor(Math.abs(Date.now() - ISODateTimeStrings.parse(started).getTime()))

            const record: IAnswerIndexerStatusDoneV3 = {
                id: docID,
                uid,
                status: 'done',
                ver: 'v3',
                type: 'doc',
                started,
                completed: ISODateTimeStrings.create(),
                duration
            }

            await AnswerIndexStatusCollection.set(firestore, record);

        }


        await writeIndexStatusPending();

        await writer.init();

        await PDFShingleParser.parse({url: opts.url, skipPages: opts.skipPages}, async event => {

            const {shingles, pageNum, progress} = event;

            for(const shingle of shingles) {
                await writer.write({pageNum, shingle});
            }

        });

        await writer.sync();

        await writeIndexStatusDone();

    }

}

