import {
    createCachedSnapshotSubscriberContext,
} from "../../../../web/js/snapshots/CachedSnapshotSubscriberContext";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import * as React from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {DictionaryPrefs, IPersistentPrefs, StringToPrefDict} from "../../../../web/js/util/prefs/Prefs";
import {OnErrorCallback} from "polar-shared/src/util/Snapshots";
import {IUserPref, UserPrefs} from "../../../../web/js/datastore/firebase/UserPrefs";
import {useFirestore} from "../FirestoreProvider";
import UserPrefCallback2 = UserPrefs.UserPrefCallback2;

export const [UserPrefContextProvider, useUserPrefContextSnapshot] = createCachedSnapshotSubscriberContext<IUserPref>();

interface IProps {
    readonly children: JSX.Element | React.ReactNode;
}

/**
 * Use prefs and only when we actually have them.  We wait until we get the
 * first snapshot or a cached snapshot otherwise, if we provide defaults, we're
 * going to flip from the default to the pref value.
 *
 * This would be bad as we would flip from light to dark really quick (and other
 * issues).
 */
export function usePrefsContext(): IPersistentPrefs {
    const snapshot = useUserPrefContextSnapshot();
    const persistentPrefs = React.useMemo(() => SnapshotPersistentPrefs.toPersistentPrefs(snapshot.value), [snapshot]);

    return persistentPrefs;
}

export const PrefsContext2 = React.memo((props: IProps) => {

    const {firestore, uid} = useFirestore();
    const dialogs = useDialogManager();

    const snapshotSubscriber = React.useCallback((onNext: UserPrefCallback2, onError?: OnErrorCallback) => {

        if (! uid) {
            return NULL_FUNCTION;
        }

        return UserPrefs.onSnapshot2(firestore, uid, onNext, onError);

    }, [firestore, uid]);

    const onError = React.useCallback(() => {
        dialogs.confirm({
            type: 'error',
            title: 'Unable to load prefs',
            subtitle: 'We were unable to load prefs. Please restart.',
            onAccept: NULL_FUNCTION
        })
    }, [dialogs]);

    return (

        <UserPrefContextProvider id='prefs_context'
                                 snapshotSubscriber={snapshotSubscriber}
                                 onError={onError}
                                 predicate={value => value !== undefined}>

            {props.children}

        </UserPrefContextProvider>
    )

});

class SnapshotPersistentPrefs extends DictionaryPrefs implements IPersistentPrefs {

    constructor(delegate: StringToPrefDict) {
        super(delegate);
    }

    public async commit(): Promise<void> {
        await UserPrefs.set(this);
    }

    public static toPersistentPrefs(userPref: IUserPref | undefined): IPersistentPrefs {

        if (! userPref) {
            // the user has no existing prefs in the store so we have to return an empty dict
            // which will later be written.
            return new SnapshotPersistentPrefs({});
        }

        const dictionaryPrefs = new DictionaryPrefs(userPref.value);
        return new SnapshotPersistentPrefs(dictionaryPrefs.toPrefDict());

    }

}

