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
     * @param newPermissions The array of permissions to apply.
     */
    export async function doUpdatePagePermissions(firestore: IFirestore<unknown>,
                                                  uid: UserIDStr,
                                                  id: BlockIDStr,
                                                  newPermissions: BlockPermissionMap) {

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
        if (effectivePerms[uid]?.access !== 'admin') {
            throw new Error("User does not have admin to change permissions on this page: " + id);
        }

        if (newPermissions['__public__']?.access === 'admin') {
            throw new Error("Not allowed to set __public__ permissions to 'admin'" + id);
        }

        const currentPermissions = BlockPermissionCollection.get(firestore, id);

        // FIXME: now apply this to block_permission_user and persist.. we have
        // to fetch each record from the DB though...  build it as a map and pass that in as the exicting values...

        // FIXME if we LOSE permissions make sure they are removed too.
        // FIXME: we also need to handle upgrade and downgrade of permissions


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

