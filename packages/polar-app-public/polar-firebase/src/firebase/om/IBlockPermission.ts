import {UserIDStr} from "polar-firestore-like/src/IFirestore";

export type AccessType = 'read' | 'comment' | 'write';

/**
 * This is a magic string to denote public access for a resource.
 */
export type PublicUserIDStr = '__public__';

export type BlockPermissionUserIDStr = UserIDStr | PublicUserIDStr;

export interface IBlockPermission {
    readonly id: UserIDStr;
    readonly uid: BlockPermissionUserIDStr;
    readonly access: AccessType;
}
