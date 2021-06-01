import { ISODateTimeStrings } from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlockIDStr, IBlockContent} from "./BlocksStore";
import {IBlock, IBlockLink, NamespaceIDStr} from "./IBlock";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {PositionalArrays} from "./PositionalArrays";
import {UserIDStr} from "../../firebase/Firebase";

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
            uid: opts.uid || uid,
            nspace: opts.nspace || nspace,
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
