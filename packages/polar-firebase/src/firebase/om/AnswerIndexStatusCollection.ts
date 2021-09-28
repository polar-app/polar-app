import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IDStr, JSONStr} from "polar-shared/src/util/Strings";
import {IAnswerExecutorTrace} from "polar-answers-api/src/IAnswerExecutorTrace";
import {IAnswerExecutorTraceUpdate} from "polar-answers-api/src/IAnswerExecutorTraceUpdate";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

/**
 * Keeps marks for our AI full-text index so that we can mark records with
 * metadata for custom handling outside of ES
 *
 */
export namespace AnswerExecutorTraceCollection {

    const COLLECTION_NAME = 'answer_index_status';

    export interface IAnswerIndexerStatus {

        /**
         * The ID is the same ID as of the item we're indexing.  If it's a doc
         * then it's a docID.
         */
        readonly id: IDStr;
        readonly status: 'pending' | 'done';
        readonly ver: 'v1';
        readonly type: 'doc';
    }

    export interface IAnswerIndexerUpdate extends Pick<IAnswerIndexerStatus, 'id'> {
        readonly status: 'done';
    }

    export async function set<SM = unknown>(firestore: IFirestore<SM>, status: IAnswerIndexerStatus) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(status.id);

        await ref.set(Dictionaries.onlyDefinedProperties(status));

    }

    export async function update<SM = unknown>(firestore: IFirestore<SM>, id: IDStr, update: IAnswerIndexerUpdate) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(update.id);

        const data = {status: update.status};
        await ref.set(data, {merge: true});

    }

}


