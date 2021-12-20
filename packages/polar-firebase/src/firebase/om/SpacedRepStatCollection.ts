import {CollectionNameStr, IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {RepetitionMode, StageCounts} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Collections} from "polar-firestore-like/src/Collections";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import Clause = Collections.Clause;

/**
 * Stores card stats for a user each time they compute a new queue so that we can keep track
 * of things over time and show the user stats regarding much work they have left.
 */
export namespace SpacedRepStatCollection {

    export const COLLECTION_NAME: CollectionNameStr = "spaced_rep_stat";

    /**
     * Write a new stat to the database.
     */
    export async function write<SM = unknown>(firestore: IFirestore<SM>, uid: UserIDStr, spacedRepStat: SpacedRepStat): Promise<SpacedRepStatRecord> {

        const id = Hashcodes.createRandomID();

        const spacedRepStatRecord: SpacedRepStatRecord = {
            id, uid,
            ...spacedRepStat,
            created: ISODateTimeStrings.create(),
        };

        await Collections.set(firestore, COLLECTION_NAME, id, spacedRepStatRecord);

        return spacedRepStatRecord;
    }

    /**
     * Return true if this user has stats.
     */
    export async function hasStats<SM = unknown>(firestore: IFirestore<SM>, uid: UserIDStr): Promise<boolean> {

        const clauses: ReadonlyArray<Clause> = [
            ['uid', '==', uid],
        ];

        const result = await Collections.list(firestore, COLLECTION_NAME, clauses, {limit: 1});
        return result.length > 0;

    }

}


/**
 * A basic stat must have a mode.
 */
export interface IStat {
    readonly created: ISODateTimeString;
    readonly mode: RepetitionMode;
}

export type StatType = 'queue' | 'completed';

/**
 * Stats on the queue of items computed to the user has some understanding of how much work they have left.
 */
export interface QueueStat extends IStat, StageCounts {
    readonly type: 'queue';
}

export interface CompletedStat extends IStat, StageCounts {
    readonly type: 'completed';
}

export interface ISpacedRepStatRecord {

    readonly id: IDStr;

    /**
     * The user ID / owner of this card.
     */
    readonly uid: UserIDStr;

    /**
     * The time this stat was recorded.
     */
    readonly created: ISODateTimeString;

    readonly mode: RepetitionMode;

    readonly type: 'queue' | 'completed';

}

export type SpacedRepStat = QueueStat | CompletedStat;

export type SpacedRepStatRecord = SpacedRepStat & ISpacedRepStatRecord;
