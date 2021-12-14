import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {BlockNameStr} from "./BlocksStore";
import {BlockIDStr, NamespaceIDStr, UIDStr} from "polar-blocks/src/blocks/IBlock";

/**
 * The length of hashcodes that we should use.
 */
const LEN = 20;

export namespace BlockIDs {

    /**
     * New block ID factory
     */
    export function create(name: BlockNameStr, nspace: NamespaceIDStr | UIDStr): BlockIDStr {
        return Hashcodes.createID({name: name.toLowerCase(), nspace}, LEN);
    }

    /**
     * Create a block ID for a non-named block that's just a child.
     */
    export function createRandom(): BlockIDStr {
        return Hashcodes.createRandomID({len: LEN});
    }

}
