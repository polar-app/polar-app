import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";
import {UserIDStr} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {BlockIDStr, IBlock, IBlockContent, IBlockLink, NamespaceIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockIDs} from "polar-blocks/src/util/BlockIDs";

export namespace BlocksStoreTests {

    import PositionalArray = PositionalArrays.PositionalArray;

    export interface IBasicBlockOpts<C> {
        readonly id?: BlockIDStr;
        readonly root?: BlockIDStr;
        readonly uid?: UserIDStr;
        readonly nspace?: NamespaceIDStr;
        readonly parent?: BlockIDStr;
        readonly parents?: ReadonlyArray<BlockIDStr>
        readonly content: C;
        readonly items?: PositionalArray<BlockIDStr>;
        readonly links?: PositionalArray<IBlockLink>;
        readonly mutation?: number;
    }

    export function createBasicBlock<C extends IBlockContent = IBlockContent>(opts: IBasicBlockOpts<C>): IBlock<C> {

        const nspace = '234'
        const uid = '1234'
        const created = ISODateTimeStrings.create();
        const id = opts.id || Hashcodes.createRandomID();

        return {
            id: opts.id || BlockIDs.createRandom(),
            nspace: opts.nspace || nspace,
            uid: opts.uid || uid,
            created,
            updated: created,
            ...opts,
            root: opts.root || id,
            parent: opts.parent,
            parents: opts.parents || [],
            items: opts.items || {},
            mutation: opts.mutation || 0
        }

    }
}
