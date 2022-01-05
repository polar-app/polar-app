import {IDUser} from "polar-rpc/src/IDUser";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {PrivateBetaReqCollection} from "polar-firebase/src/firebase/om/PrivateBetaReqCollection";

export namespace WaitingUsers {

    export interface Response {
        readonly list: ReadonlyArray<PrivateBetaReqCollection.IPrivateBetaReq>,
    }

    export interface ErrorResponse {
        error: string,
    }

    /**
     * If the provided user can list the waiting users list
     * @param idUser
     * @private
     */
    function isAuthorized(idUser: IDUser) {
        const allowed = [
            'dzhuneyt@getpolarized.io',
            'jonathan@getpolarized.io',
            'burton@getpolarized.io',
            'jonathan.graeupner@gmail.com',
        ];
        return allowed.includes(idUser.user.email);
    }

    export async function getList(idUser: IDUser): Promise<Response | ErrorResponse> {
        if (!isAuthorized(idUser)) {
            return {error: 'Not authorized'}
        }

        const firestore = FirestoreAdmin.getInstance();

        const list = await PrivateBetaReqCollection.list(firestore);

        return {
            list,
        }
    }
}
