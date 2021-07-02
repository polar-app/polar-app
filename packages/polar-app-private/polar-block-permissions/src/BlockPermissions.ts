import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockCollection} from "polar-firebase/src/firebase/om/BlockCollection";
import {BlockPermissionNSpaceCollection} from "polar-firebase/src/firebase/om/BlockPermissionNSpaceCollection";
import {IBlockPermission} from "polar-firebase/src/firebase/om/IBlockPermission";

export namespace BlockPermissions {

    /**
     *
     * @param firestore  The Firestore instance to use
     * @param id The ID of the page which needs permissions mutated.
     * @param permissions The array of permissions to apply.
     */
    export async function doUpdatePagePermissions(firestore: IFirestore<unknown>,
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
        BlockPermissionNSpaceCollection.get(firestore, id);

        // ** verify that the user is admin

    }

    /**
     * Take the nspace permissions and merge them with the page permissions.
     */
    export async function computeEffectivePermissionsForPage() {

    }

}

