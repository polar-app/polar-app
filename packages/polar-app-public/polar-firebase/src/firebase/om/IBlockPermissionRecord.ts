import {BlockPermissionUserIDStr, IBlockPermission} from "./IBlockPermission";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import { ISODateTimeString } from "polar-shared/src/metadata/ISODateTimeStrings";

/**
 * The type of block record types.
 *
 * page: permissions for an specific page
 * nspace: permissions for an entire namespace
 * effective: the effective / merged permissions for nspace and page.
 */
export type BlockPermissionRecordType = 'page' | 'nspace' | 'effective';

export type BlockPermissionMap = {[uid in BlockPermissionUserIDStr]: IBlockPermission}

export interface IBlockPermissionRecord<T extends BlockPermissionRecordType> {
    readonly id: BlockIDStr;
    readonly type: T;
    readonly updated: ISODateTimeString;
    readonly permissions: Readonly<BlockPermissionMap>;
}

