import {SubscriptionValue, useSnapshotSubscriber} from "../../../../web/js/ui/data_loader/UseSnapshotSubscriber";
import {IUserPref, UserPrefs} from "../../../../web/js/datastore/firebase/UserPrefs";
import {useFirestore} from "../FirestoreProvider";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export function useUserPrefs(): SubscriptionValue<IUserPref> {

    const {uid, firestore} = useFirestore();

    // const dictionaryPrefs = new DictionaryPrefs(userPref.value);
    // return new FirebaseDatastorePrefs(dictionaryPrefs.toPrefDict());

    const snapshotSubscriber = (onNext: (data: IUserPref | undefined) => void, onError?: (err: Error) => void) => {

        if (! uid) {
            console.warn("No user");
            return NULL_FUNCTION;
        }

        return UserPrefs.onSnapshot(firestore, uid, onNext, onError);

    }

    return useSnapshotSubscriber({id: 'user_prefs', subscribe: snapshotSubscriber});

}
