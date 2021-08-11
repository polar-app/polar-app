import {IDStr, UserIDStr, CollectionNameStr} from "polar-shared/src/util/Strings";
import {RepetitionMode, StageCounts} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ISODateTimeString, ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Collections} from "polar-firestore-like/src/Collections";

import Clause = Collections.Clause;
import {IFirestore} from "polar-firestore-like/src/IFirestore";
/**
 * Stores card stats for a user each time they compute a new queue so that we can keep track
 * of things over time and show the user stats regarding much work they have left.
 */
export class SpacedRepStatCollection {

    private static COLLECTION: CollectionNameStr = "spaced_rep_stat";

    /**
     * Write a new stat to the database.
     */
    public static async write<SM = unknown>(firestore: IFirestore<SM>, uid: UserIDStr, spacedRepStat: SpacedRepStat): Promise<SpacedRepStatRecord> {

        const id = Hashcodes.createRandomID();

        const spacedRepStatRecord: SpacedRepStatRecord = {
            id, uid,
            ...spacedRepStat,
            created: ISODateTimeStrings.create(),
        };

        await Collections.set(firestore, this.COLLECTION, id, spacedRepStatRecord);

        return spacedRepStatRecord;
    }

    /**
     * Get the most recent stats for for the given mode.
     */
    public static async list<SM = unknown>(firestore: IFirestore<SM>, uid: UserIDStr,
                             mode: RepetitionMode,
                             type: StatType): Promise<ReadonlyArray<SpacedRepStatRecord>> {

        const clauses: ReadonlyArray<Clause> = [
            ['uid', '==', uid],
            ['mode', '==', mode],
            ['type', '==', type]
        ];

        return await Collections.list(firestore, this.COLLECTION, clauses);

    }

    /**
     * Return true if this user has stats.
     */
    public static async hasStats<SM = unknown>(firestore: IFirestore<SM>, uid: UserIDStr): Promise<boolean> {

        const clauses: ReadonlyArray<Clause> = [
            ['uid', '==', uid],
        ];

        const result = await Collections.list(firestore, this.COLLECTION, clauses, {limit: 1});
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

}

export type SpacedRepStat = QueueStat | CompletedStat;

export type SpacedRepStatRecord = SpacedRepStat & ISpacedRepStatRecord;
