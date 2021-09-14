import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IDStr, JSONStr} from "polar-shared/src/util/Strings";
import {IAnswerExecutorTrace} from "polar-answers-api/src/IAnswerExecutorTrace";
import {IAnswerExecutorTraceUpdate} from "polar-answers-api/src/IAnswerExecutorTraceUpdate";

/**
 * Keeps marks for our AI full-text index so that we can mark records with
 * metadata for custom handling outside of ES
 *
 */
export namespace AnswerExecutorTraceCollection {

    const COLLECTION_NAME = 'answer_executor_trace';

    interface IRecordHolder {
        readonly id: IDStr;
        readonly data: JSONStr;
    }

    export async function set<SM = unknown>(firestore: IFirestore<SM>, id: IDStr, trace: IAnswerExecutorTrace) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(id);

        const record: IRecordHolder = {
            id,
            data: JSON.stringify(trace)
        }

        await ref.set(record);

    }

    export async function update<SM = unknown>(firestore: IFirestore<SM>, id: IDStr, update: IAnswerExecutorTraceUpdate) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(id);

        const snapshot = await ref.get();

        if (snapshot.exists) {

            const record = snapshot.data() as IRecordHolder;
            const recordAsTrace: IAnswerExecutorTrace = JSON.parse(record.data);

            const newTrace = <IAnswerExecutorTrace> {
                ...recordAsTrace,
                vote: update.vote,
                expectation: update.expectation
            }

            await ref.update(newTrace);

        } else {
            throw new Error("Record does not exist");
        }

    }

}


