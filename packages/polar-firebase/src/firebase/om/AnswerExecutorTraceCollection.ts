import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IDStr} from "polar-shared/src/util/Strings";

/**
 * Keeps marks for our AI full-text index so that we can mark records with
 * metadata for custom handling outside of ES
 *
 */
export namespace AnswerExecutorTraceCollection {

    const COLLECTION_NAME = 'answer_executor_trace';

    export interface IAnswerRating {

        readonly id: IDStr;
        readonly uid: string;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        readonly request: any;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        readonly response: any;

        readonly status: 'good' | 'bad';

    }

    export async function write<SM = unknown>(firestore: IFirestore<SM>, id: IDStr, rating: IAnswerRating) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(id);

        await ref.set(rating);

    }

}


