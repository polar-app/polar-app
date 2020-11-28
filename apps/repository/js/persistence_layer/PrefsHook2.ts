import {SubscriptionValue, useSnapshotSubscriber} from "../../../../web/js/ui/data_loader/UseSnapshotSubscriber";
import {UserPref, UserPrefs} from "../../../../web/js/datastore/firebase/UserPrefs";
import {useFirestore} from "../FirestoreProvider";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {DictionaryPrefs} from "../../../../web/js/util/prefs/Prefs";

export function useUserPrefs(): SubscriptionValue<UserPref> {

    const {uid, firestore} = useFirestore();

    // const dictionaryPrefs = new DictionaryPrefs(userPref.value);
    // return new FirebaseDatastorePrefs(dictionaryPrefs.toPrefDict());

    const snapshotSubscriber = (onNext: (data: UserPref | undefined) => void, onError?: (err: Error) => void) => {

        if (! uid) {
            console.warn("No user");
            return NULL_FUNCTION;
        }

        return UserPrefs.onSnapshot(firestore, uid, onNext, onError);

    }

    return useSnapshotSubscriber({id: 'user_prefs', subscribe: snapshotSubscriber});

}
