import {BlockPermissionUserIDStr} from "./IBlockPermissionEntry";
import {BlockIDStr, NamespaceIDStr} from "polar-blocks/src/blocks/IBlock";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

/**
 * Represents which pages and nspaces a specific user is allowed to read.
 */
export interface IBlockPermissionUser {

    readonly id: BlockPermissionUserIDStr;
    readonly uid: BlockPermissionUserIDStr;

    readonly updated: ISODateTimeString;

    // *** the pages they can access
    // eslint-disable-next-line camelcase
    readonly pages_ro: ReadonlyArray<BlockIDStr>;
    // eslint-disable-next-line camelcase
    readonly pages_rw: ReadonlyArray<BlockIDStr>;

    // *** the nspaces they can access
    // eslint-disable-next-line camelcase
    readonly nspaces_ro: ReadonlyArray<NamespaceIDStr>;
    // eslint-disable-next-line camelcase
    readonly nspaces_rw: ReadonlyArray<NamespaceIDStr>;

    // // *** specific page permissions
    // eslint-disable-next-line camelcase
    // readonly pages_read: ReadonlyArray<BlockIDStr>;
    // eslint-disable-next-line camelcase
    // readonly pages_write: ReadonlyArray<BlockIDStr>;
    // eslint-disable-next-line camelcase
    // readonly pages_comment: ReadonlyArray<BlockIDStr>;
    //
    // // *** specific nspace permissions
    // eslint-disable-next-line camelcase
    // readonly nspaces_read: ReadonlyArray<BlockIDStr>;
    // eslint-disable-next-line camelcase
    // readonly nspaces_write: ReadonlyArray<BlockIDStr>;
    // eslint-disable-next-line camelcase
    // readonly nspaces_comment: ReadonlyArray<BlockIDStr>;

}

