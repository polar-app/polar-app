import {IDUser} from '../util/IDUsers';
import {SentryReporters} from "../reporters/SentryReporter";
import {IBlockPermission} from "polar-firebase/src/firebase/om/IBlockPermission";
import {BlockPermissions} from "polar-block-permissions/src/BlockPermissions";
import {FirestoreAdmin} from 'polar-firebase-admin/src/FirestoreAdmin';
import {NSpaceCollection} from "polar-firebase/src/firebase/om/NSpaceCollection";
import {NSpaces} from "polar-block-permissions/src/NSpaces";

export interface INSpaceCreateResponse {

}

export namespace NSpaceCreateFunctions {

    import INSpaceInit = NSpaceCollection.INSpaceInit;

    export async function exec(idUser: IDUser,
                               request: INSpaceInit): Promise<INSpaceCreateResponse> {

        try {

            const firestore = FirestoreAdmin.getInstance();

            await NSpaces.create(firestore, idUser.uid, request);

            return {};

        } catch (e) {
            SentryReporters.reportError("Failed to run NSpaceCreateFunction: ", e);
            return {error: 'no-result'};
        }

    }

}
