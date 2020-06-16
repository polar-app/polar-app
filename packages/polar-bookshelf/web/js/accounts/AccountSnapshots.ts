import {Account} from "./Account";
import {AccountSnapshot} from "./Accounts";
import {UserIDStr} from "../firebase/Firebase";
import {Callback1} from "polar-shared/src/util/Functions";
import * as firebase from "firebase";

const COLLECTION_NAME = "account";

interface IAccountSnapshots {
    readonly onSnapshot: (uid: string,
                          handler: Callback1<AccountSnapshot>,
                          errorHandler?: Callback1<Error>) => void;
}

export namespace AccountSnapshots {

    export function create(firestore: firebase.firestore.Firestore): IAccountSnapshots {

        function createRef(uid: UserIDStr) {

            return firestore
                .collection(COLLECTION_NAME)
                .doc(uid);

        }

        function onSnapshot(uid: string,
                            handler: Callback1<AccountSnapshot>,
                            errorHandler: Callback1<Error> = ERR_HANDLER) {

            const ref = createRef(uid);

            return ref.onSnapshot(snapshot => {

                if (! snapshot.exists) {
                    handler(undefined);
                    return;
                }

                const account = <Account> snapshot.data();
                handler(account);

            }, errorHandler);

        }

        return {onSnapshot};

    }

}

const ERR_HANDLER = (err: Error) => console.error("Could not create snapshot for account: ", err);
