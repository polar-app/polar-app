/* eslint-disable camelcase */
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

    readonly pages_ro: ReadonlyArray<BlockIDStr>;
    readonly pages_rw: ReadonlyArray<BlockIDStr>;

    // *** the nspaces they can access

    readonly nspaces_ro: ReadonlyArray<NamespaceIDStr>;
    readonly nspaces_rw: ReadonlyArray<NamespaceIDStr>;

    // // *** specific page permissions
    // readonly pages_read: ReadonlyArray<BlockIDStr>;
    // readonly pages_write: ReadonlyArray<BlockIDStr>;
    // readonly pages_comment: ReadonlyArray<BlockIDStr>;
    //
    // // *** specific nspace permissions
    // readonly nspaces_read: ReadonlyArray<BlockIDStr>;
    // readonly nspaces_write: ReadonlyArray<BlockIDStr>;
    // readonly nspaces_comment: ReadonlyArray<BlockIDStr>;

}

