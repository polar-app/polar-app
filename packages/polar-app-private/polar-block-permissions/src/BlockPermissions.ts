import {IFirestore, UserIDStr} from "polar-firestore-like/src/IFirestore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockCollection} from "polar-firebase/src/firebase/om/BlockCollection";
import {IBlockPermission} from "polar-firebase/src/firebase/om/IBlockPermission";
import {BlockPermissionMap, IBlockPermissionRecord} from "polar-firebase/src/firebase/om/IBlockPermissionRecord";
import {BlockPermissionCollection} from "polar-firebase/src/firebase/om/BlockPermissionCollection";

export namespace BlockPermissions {

    /**
     *
     * @param firestore  The Firestore instance to use
     * @param uid: The user making the permission changes.
     * @param id The ID of the page which needs permissions mutated.
     * @param permissions The array of permissions to apply.
     */
    export async function doUpdatePagePermissions(firestore: IFirestore<unknown>,
                                                  uid: UserIDStr,
                                                  id: BlockIDStr,
                                                  permissions: ReadonlyArray<IBlockPermission>) {

        // ** verify that this block exists and that it's the right type.

        const block = await BlockCollection.get(firestore, id);

        if (! block) {
            throw new Error("No block for id: " + id);
        }

        if (block.parent !== undefined) {
            throw new Error("Not root block");
        }

        // ** get the current permissions for this page
        const pagePerms: IBlockPermissionRecord<'page'> | undefined = await BlockPermissionCollection.get(firestore, block.id);
        const nspacePerms: IBlockPermissionRecord<'nspace'> | undefined = await BlockPermissionCollection.get(firestore, block.nspace);

        const effectivePerms = computeEffectivePermissionsForPage(pagePerms, nspacePerms);

        // ** verify that the user is admin

    }

    /**
     * Take the nspace permissions and merge them with the page permissions.
     */
    export function computeEffectivePermissionsForPage(page: IBlockPermissionRecord<'page'> | undefined,
                                                       nspace: IBlockPermissionRecord<'nspace'> | undefined): Readonly<BlockPermissionMap> {

        const result: BlockPermissionMap = {};

        Object.values(nspace?.permissions || {}).map(current => result[current.uid] = current);

        Object.values(page?.permissions || {}).map(current => result[current.uid] = current);

        return result;

    }

}

