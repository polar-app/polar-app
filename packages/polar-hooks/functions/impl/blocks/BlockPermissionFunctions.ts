import {IDUser} from '../util/IDUsers';
import {SentryReporters} from "../reporters/SentryReporter";
import {IBlockPermission} from "polar-firebase/src/firebase/om/IBlockPermission";
import {BlockPermissions} from "polar-block-permissions/src/BlockPermissions";
import {FirestoreAdmin} from 'polar-firebase-admin/src/FirestoreAdmin';

export interface IBlockPermissionResponse {

}

export namespace BlockPermissionFunctions {

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
