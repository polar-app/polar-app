import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {IDStr, JSONStr} from "polar-shared/src/util/Strings";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {UserIDStr} from "../Collections";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

/**
 * Keeps marks for our AI full-text index so that we can mark records with
 * metadata for custom handling outside of ES
 *
 */
export namespace AnswerIndexStatusCollection {

    const COLLECTION_NAME = 'answer_index_status';

    export interface IAnswerIndexerStatusLegacy {

        /**
         * The ID is the same ID as of the item we're indexing.  If it's a doc
         * then it's a docID.
         */
        readonly id: IDStr;
        readonly uid: UserIDStr;
        readonly status: 'pending' | 'done';
        readonly ver: 'v1' | 'v2';
        readonly type: 'doc';

    }

    export interface IAnswerIndexerStatusPendingV3 {

        /**
         * The ID is the same ID as of the item we're indexing.  If it's a doc
         * then it's a docID.
         */
        readonly id: IDStr;
        readonly uid: UserIDStr;
        readonly status: 'pending';
        readonly ver: 'v3';
        readonly type: 'doc';
        readonly started: ISODateTimeString;

    }

    export interface IAnswerIndexerStatusDoneV3 {

        /**
         * The ID is the same ID as of the item we're indexing.  If it's a doc
         * then it's a docID.
         */
        readonly id: IDStr;
        readonly uid: UserIDStr;
        readonly status: 'done';
        readonly ver: 'v3';
        readonly type: 'doc';
        readonly started: ISODateTimeString;
        readonly completed: ISODateTimeString;
        // The index duration, in seconds.
        readonly duration: number;

    }

    export interface IAnswerIndexerStatusFailedV3 {

        readonly id: IDStr;
        readonly uid: UserIDStr;
        readonly status: 'failed';
        readonly ver: 'v3';
        readonly type: 'doc';
        readonly started: ISODateTimeString;
        readonly completed: ISODateTimeString;
        // The index duration, in seconds.
        readonly duration: number;
        readonly message: string | undefined;

    }


    export type IAnswerIndexerStatus = IAnswerIndexerStatusLegacy | IAnswerIndexerStatusPendingV3 | IAnswerIndexerStatusDoneV3 | IAnswerIndexerStatusFailedV3;

    export interface IAnswerIndexerUpdate extends Pick<IAnswerIndexerStatus, 'id'> {
        readonly status: 'done';
    }

    export async function set<SM = unknown>(firestore: IFirestore<SM>, status: IAnswerIndexerStatus) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(status.id);

        await ref.set(Dictionaries.onlyDefinedProperties(status));

    }

    export async function update<SM = unknown>(firestore: IFirestore<SM>, update: IAnswerIndexerUpdate) {

        const collection = firestore.collection(COLLECTION_NAME)
        const ref = collection.doc(update.id);

        const data = {status: update.status};
        await ref.set(data, {merge: true});

    }

}


