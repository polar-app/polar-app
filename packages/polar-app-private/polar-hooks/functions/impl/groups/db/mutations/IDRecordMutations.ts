import {ISODateTimeStrings, ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {IDMaps} from "polar-shared/src/util/IDMaps";

// TODO: migrate to polar-shared

/**
 *
 */
export class IDRecordMutations {

    public static mutations<V extends IDRecord>(prev: ReadonlyArray<V>,
                                                curr: ReadonlyArray<V>): ReadonlyArray<IDRecordMutation<V>> {

        const prevMap = IDMaps.create(prev);
        const currMap = IDMaps.create(curr);

        const result: Array<IDRecordMutation<V>> = [];

        const identifiers = SetArrays.union(IDMaps.toIdentifiers(curr), IDMaps.toIdentifiers(prev));

        for (const id of identifiers) {

            const prev = prevMap[id];
            const curr = currMap[id];
            const hasMutated = prev && curr && this.hasMutated(prev, curr);

            result.push({id, curr, prev, hasMutated});

        }

        return result;

    }

    public static hasMutated(prev: IDRecord, curr: IDRecord) {
        // return true if current version of the record has updated vs the prev version

        const toTimestamp = (record: IDRecord): Date => {
            return ISODateTimeStrings.parse(record.lastUpdated || record.created);
        };

        return toTimestamp(curr).getTime() > toTimestamp(prev).getTime();

    }

}

/**
 * Contains a record of what has changed between two sets.
 *
 * If `curr` is missing the record has been deleted.
 *
 * If `prev` is missing it's a new record.
 *
 * If they are both present it's an update if hasMutated is true.
 *
 */
export interface IDRecordMutation<V> {
    readonly id: IDString;
    readonly prev?: V;
    readonly curr?: V;
    readonly hasMutated: boolean;
}

export interface IDRecord {
    readonly id: IDString;
    readonly created: ISODateTimeString;
    readonly lastUpdated: ISODateTimeString;
}

/**
 * The ID of a record.
 */
export type IDString = string;
