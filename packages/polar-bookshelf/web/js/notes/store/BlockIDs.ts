import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {BlockNameStr} from "./BlocksStore";
import {NamespaceIDStr, UIDStr} from "polar-blocks/src/blocks/IBlock";

/**
 * The length of hashcodes that we should use.
 */
const LEN = 20;

export namespace BlockIDs {

    /**
     * New block ID factory
     */
    export function create(name: BlockNameStr, nspace: NamespaceIDStr | UIDStr) {
        return Hashcodes.createID({name, nspace}, LEN);
    }

    /**
     * Create a block ID for a non-named block that's just a child.
     */
    export function createRandom() {
        return Hashcodes.createRandomID({len: LEN});
    }

}
