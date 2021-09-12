import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IDStr} from "polar-shared/src/util/Strings";
import {IAnswerExecutorTrace} from "polar-answers-api/src/IAnswerExecutorTrace";

/**
 * Keeps marks for our AI full-text index so that we can mark records with
 * metadata for custom handling outside of ES
 *
 */
export namespace AnswerExecutorTraceCollection {

    const COLLECTION_NAME = 'answer_executor_trace';

    export async function set<SM = unknown>(firestore: IFirestore<SM>, id: IDStr, trace: IAnswerExecutorTrace) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(id);

        await ref.set(trace);

    }

    export async function update<SM = unknown>(firestore: IFirestore<SM>, id: IDStr, trace: Pick<IAnswerExecutorTrace, 'vote' | 'expectation'>) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(id);

        await ref.update(trace);

    }

}


