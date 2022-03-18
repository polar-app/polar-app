import {ExpressFunctions} from "../util/ExpressFunctions";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {AuthChallengeCollection} from "polar-firebase/src/firebase/om/AuthChallengeCollection";
import {IDUser} from "polar-rpc/src/IDUser";
import {FirebaseUserPurger} from "polar-firebase-users/src/FirebaseUserPurger";


interface IRequest {
    code: string,
}

export const FinishAccountDeleteFunction = ExpressFunctions.createRPCHook('FinishAccountDeleteFunction', async (idUser: IDUser, request: IRequest) => {
    const email = idUser.user.email;

    const code = request.code;

    const firestore = FirestoreAdmin.getInstance();
    const authChallenge = await AuthChallengeCollection.get(firestore, email);

    if (authChallenge?.challenge !== code) {
        return {code: 'invalid-challenge'};
    }

    await FirebaseUserPurger.doPurge(idUser.uid);

    return {code: 'ok'};
});
