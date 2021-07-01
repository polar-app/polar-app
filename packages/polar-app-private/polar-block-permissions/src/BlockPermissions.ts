import {UserIDStr} from "packages/polar-app-public/polar-firebase/src/firebase/om/ProfileCollection";
import {IFirestore} from "polar-firestore-like/src/IFirestore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

export namespace BlockPermissions {

    /**
     *
     * @param firestore  The Firestore instance to use
     * @param id The ID of the page which needs permissions mutated.
     * @param permissions The array of permissions to apply.
     */
    export async function doUpdatePagePermissions(firestore: IFirestore<unknown>,
                                                  id: BlockIDStr,
                                                  permissions: ReadonlyArray<IPermission>) {

        // ** get the current permissions for this page

        // ** verify that the user is admin

    }

    /**
     * Take the nspace permissions and merge them with the page permissions.
     */
    export async function computeEffectivePermissionsForPage() {

    }

}


export type AccessType = 'read' | 'comment' | 'write';

export interface IPermission {
    readonly id: UserIDStr;
    readonly uid: UserIDStr;
    readonly access: AccessType;
}
