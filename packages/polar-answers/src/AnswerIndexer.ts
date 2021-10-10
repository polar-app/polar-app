import {UserIDStr} from "polar-shared/src/util/Strings";
import {PDFText} from "polar-pdf/src/pdf/PDFText";
import {SentenceShingler} from "./SentenceShingler";
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

        const writer = ESShingleWriter.create({uid});

        const firestore = FirestoreAdmin.getInstance();

        await AnswerIndexStatusCollection.set(firestore, {
            id: docID,
            uid,
            status: 'pending',
            ver: 'v1',
            type: 'doc'
        });

        // TODO major bug / feature error here.  Text across pages isn't
        // assembled properly.  We're also not really able to tell if
        // the text on the next page is the continuation of the text on
        // the current page.

        await PDFShingleParser.parse({url: opts.url, skipPages: opts.skipPages}, async event => {

            const {shingles, pageNum} = event;

            for(const shingle of shingles) {
                await writer.write({docID, pageNum, shingle});
            }

        });

        await writer.sync();

        await AnswerIndexStatusCollection.update(firestore, {
            id: docID,
            status: 'done',
        });

    }

}

