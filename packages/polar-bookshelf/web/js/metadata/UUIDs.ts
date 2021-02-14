import {UUID} from 'polar-shared/src/metadata/UUID';
import {Sequence, Sequences} from '../util/Sequences';

export namespace UUIDs {

    export function create(): UUID {
        return Sequences.create();
    }

    export function parse(sequence: Sequence | undefined) {
        return Sequences.parse(sequence);
    }

    export function toNonce(sequence: Sequence | undefined): string | undefined {
        return parse(sequence)?.nonce;
    }

    /**
     * Format the UUID as a string
     */
    export function format(uuid: UUID | undefined) {

        if (uuid === undefined) {
            return 'undefined';
        }

        const seq = parse(uuid);

        return `${uuid} (nonce=${seq?.nonce})`

    }

    /**
     * @Deprecated use compare2 as that uses the proper compare semantics.
     */
    export function compare(u0?: UUID, u1?: UUID) {

        if (u0 === undefined && u1 !== undefined) {
            return -1;
        }

        if (u0 === undefined && u1 === undefined) {
            return 0;
        }

        if (u0 !== undefined && u1 === undefined) {
            return 1;
        }

        return cmp(u0!, u1!);

    }

    export function compare2(u0?: UUID, u1?: UUID) {

        if (u0 === undefined && u1 !== undefined) {
            return -1;
        }

        if (u0 === undefined && u1 === undefined) {
            return 0;
        }

        if (u0 !== undefined && u1 === undefined) {
            return 1;
        }

        return cmp2(u0!, u1!);

    }

    /**
     * @VisibleForTesting Only used so that we can test the same compare function we're using internally.
     * @Deprecated use cmp2 as that uses the proper compare semantics.
     */
    export function cmp(s0: string, s1: string) {
        // TODO: It's better to NOT use localeCompare but couldn't find an
        // easy workaround and since the chars are just ASCII we should be fine.
        return s0!.localeCompare(s1!, "en-us");
    }

    /**
     * Compares its two arguments for order. Returns a negative integer, zero, or a positive integer as the first
     * argument is less than, equal to, or greater than the second.
     */
    export function cmp2(s0: string, s1: string) {
        // TODO: It's better to NOT use localeCompare but couldn't find an
        // easy workaround and since the chars are just ASCII we should be fine.
        return s1!.localeCompare(s0!, "en-us");
    }

    /**
     * Return true if the 'comparison' UUID is updated later than the existing
     * UUID.
     */
    export function isUpdated(existing?: UUID, comparison?: UUID): boolean {
        return compare(existing, comparison) < 0;
   }

}
