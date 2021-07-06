import {BlockPermissionUserIDStr} from "./IBlockPermission";
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

}

