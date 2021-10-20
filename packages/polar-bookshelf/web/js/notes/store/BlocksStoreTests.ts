import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";
import {UserIDStr} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {BlockIDStr, IBlock, IBlockContent, IBlockLink, NamespaceIDStr} from "polar-blocks/src/blocks/IBlock";

export namespace BlocksStoreTests {

    import PositionalArray = PositionalArrays.PositionalArray;

    export interface IBasicBlockOpts<C> {
        readonly id?: BlockIDStr;
        readonly root: BlockIDStr;
        readonly uid?: UserIDStr;
        readonly nspace?: NamespaceIDStr;
        readonly parent: BlockIDStr | undefined;
        readonly parents: ReadonlyArray<BlockIDStr>
        readonly content: C;
        readonly items?: PositionalArray<BlockIDStr>;
        readonly links?: PositionalArray<IBlockLink>;
        readonly mutation?: number;
    }

    export function createBasicBlock<C extends IBlockContent = IBlockContent>(opts: IBasicBlockOpts<C>): IBlock<C> {

        const nspace = '234'
        const uid = '1234'
        const created = ISODateTimeStrings.create();

        return {
            id: opts.id || Hashcodes.createRandomID(),
            nspace: opts.nspace || nspace,
            uid: opts.uid || uid,
            created,
            updated: created,
            ...opts,
            root: opts.root,
            parent: opts.parent || undefined,
            parents: opts.parents,
            items: opts.items || {},
            mutation: opts.mutation || 0
        }

    }
}
