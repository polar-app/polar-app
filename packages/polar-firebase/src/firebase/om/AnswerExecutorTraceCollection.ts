import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IDStr, JSONStr} from "polar-shared/src/util/Strings";
import {IAnswerExecutorTrace} from "polar-answers-api/src/IAnswerExecutorTrace";
import {IAnswerExecutorTraceUpdate} from "polar-answers-api/src/IAnswerExecutorTraceUpdate";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {FirestoreRecords} from "polar-firestore-like/src/FirestoreRecords";

/**
 * Keeps marks for our AI full-text index so that we can mark records with
 * metadata for custom handling outside of ES
 *
 */
export namespace AnswerExecutorTraceCollection {

    const COLLECTION_NAME = 'answer_executor_trace';

    interface IRecordHolder extends Required<Pick<IAnswerExecutorTrace, 'id' | 'vote' | 'created' | 'type' | 'timings' | 'uid'>> {
        readonly data: JSONStr;
    }

    function createRecordForExtendedTrace(trace: IAnswerExecutorTrace) {

        const record: IRecordHolder = {
            id: trace.id,
            vote: trace.vote,
            created: trace.created,
            type: trace.type,
            timings: trace.timings,
            uid: trace.uid,
            data: JSON.stringify(trace)
        }

        return Dictionaries.onlyDefinedProperties(record);

    }

    export async function set<SM = unknown>(firestore: IFirestore<SM>, id: IDStr, trace: IAnswerExecutorTrace) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(id);

        await ref.set(FirestoreRecords.convert(trace));

    }

    export async function update<SM = unknown>(firestore: IFirestore<SM>, id: IDStr, update: IAnswerExecutorTraceUpdate) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(id);

        const data = {
            vote: update.vote,
            expectation: update.expectation
        };

        await ref.set(data, {merge: true});

    }

}


