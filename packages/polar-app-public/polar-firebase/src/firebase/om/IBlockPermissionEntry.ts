import {UserIDStr} from "polar-firestore-like/src/IFirestore";

export type AccessType = 'read' | 'comment' | 'write' | 'admin' | 'owner';

/**
 * Similar to AccessType but mapped to just read and write.
 *
 */
export type PermissionType = 'ro' | 'rw';

/**
 * This is a magic string to denote public access for a resource.
 */
export type PublicUserIDStr = '__public__';

export type BlockPermissionUserIDStr = UserIDStr | PublicUserIDStr;

export interface IBlockPermissionEntry {
    readonly id: UserIDStr;
    readonly uid: BlockPermissionUserIDStr;
    readonly access: AccessType;
}

export namespace AccessTypes {

    export function convertToPermissionType(accessType: AccessType): PermissionType {

        switch (accessType) {

            case "owner":
                return 'rw';

            case "admin":
                return 'rw';

            case "write":
                return 'rw';

            case "comment":
                return 'ro';

            case "read":
                return 'ro';

        }

    }

}
