import {IDMaps} from "polar-shared/src/util/IDMaps";
import {SetArrays} from "polar-shared/src/util/SetArrays";

// TODO: support boolean and number in the future.
export type PrimitiveType = string;

/**
 * Keeps track of mutations in sets of primitive types.  This allows us to see a join of the previous and current values
 * to make changes between them.
 */
export class PrimitiveMutations {

    public static mutations(prev: ReadonlyArray<PrimitiveType>,
                            curr: ReadonlyArray<PrimitiveType>): ReadonlyArray<PrimitiveMutation> {

        interface PrimitiveMap {
            [key: string]: string;
        }

        const toPrimitiveMap = (values: ReadonlyArray<PrimitiveType>): PrimitiveMap => {

            const result: PrimitiveMap = {};

            for (const value of values) {
                result[value] = value;
            }

            return result;

        };

        const prevMap = toPrimitiveMap(prev);
        const currMap = toPrimitiveMap(curr);

        const result: PrimitiveMutation[] = [];

        const values = SetArrays.union(curr, prev);

        const computeChangeType = (prev: PrimitiveType, curr: PrimitiveType): ChangeType => {

            if (curr && ! prev) {
                return 'present';
            }

            if (prev && ! curr) {
                return 'absent';
            }

            return 'none';
        };

        for (const value of values) {

            const prev = prevMap[value];
            const curr = currMap[value];
            const changeType = computeChangeType(prev, curr);

            result.push({curr, prev, changeType});

        }

        return result;

    }

}

/**
 *
 */
export interface PrimitiveMutation {
    readonly prev?: PrimitiveType;
    readonly curr?: PrimitiveType;
    readonly changeType: ChangeType;
}


/**
 * The change type of whether the new value is present in the new dataset, absent in the new dataset, or there is no
 * change.
 */
export type ChangeType = 'present' | 'absent' | 'none';
