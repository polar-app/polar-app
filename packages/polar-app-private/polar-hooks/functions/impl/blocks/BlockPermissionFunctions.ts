import {IDUser} from '../util/IDUsers';
import {SentryReporters} from "../reporters/SentryReporter";
import {IBlockPermission} from "polar-firebase/src/firebase/om/IBlockPermission";
import {BlockPermissions} from "polar-block-permissions/src/BlockPermissions";
import {FirestoreAdmin} from 'polar-firebase-admin/src/FirestoreAdmin';

export interface IBlockPermissionResponse {

}

export namespace BlockPermissionFunctions {

    /**
     *
     * @param idUser has Firebase user information
     * @param request has the request we want to execute.  We need to define the request
     * params need but this is send with the original POST with what we want to classify.
     */
    export async function exec(idUser: IDUser,
                               request: IBlockPermission<'page' | 'nspace'>): Promise<IBlockPermissionResponse> {

        try {

            const firestore = FirestoreAdmin.getInstance();

            switch (request.type) {

                case "page":
                    await BlockPermissions.doUpdatePagePermissions(firestore, idUser.uid, request.id, request.permissions);
                    break;
                case "nspace":
                    await BlockPermissions.doUpdateNSpacePermissions(firestore, idUser.uid, request.id, request.permissions);
                    break;

            }

            return {};

        } catch (e) {
            SentryReporters.reportError("Failed to run BlockPermissionFunction: ", e);
            return {error: 'no-result'};
        }

    }

}
