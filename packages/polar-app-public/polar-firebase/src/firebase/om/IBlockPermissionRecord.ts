import {IBlockPermission} from "./IBlockPermission";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import { ISODateTimeString } from "polar-shared/src/metadata/ISODateTimeStrings";

export type BlockPermissionRecordType = 'page' | 'nspace';

export interface IBlockPermissionRecord<T extends BlockPermissionRecordType> {
    readonly id: BlockIDStr;
    readonly type: T;
    readonly updated: ISODateTimeString;
    readonly permissions: ReadonlyArray<IBlockPermission>;
}
