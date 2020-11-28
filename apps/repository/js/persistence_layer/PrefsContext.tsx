import {
    createCachedSnapshotSubscriberContext,
    ISnapshot
} from "../../../../web/js/snapshots/CachedSnapshotSubscriberContext";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import * as React from "react";
import {usePrefsSnapshotSubscriberFactory} from "./PrefsHook";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {IPersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {SnapshotConverter, SnapshotSubscribers} from "polar-shared/src/util/Snapshots";

export const [PrefsContextProvider, usePrefsContext] = createCachedSnapshotSubscriberContext<IPersistentPrefs>();

interface IProps {
    readonly children: JSX.Element | React.ReactNode;
}

export const PrefsContext = React.memo((props: IProps) => {

    const snapshotSubscriberFactory = usePrefsSnapshotSubscriberFactory();
    const dialogs = useDialogManager();

    const converter: SnapshotConverter<IPersistentPrefs, ISnapshot<IPersistentPrefs>> = React.useCallback((from) => {

        if (from === undefined) {
            return undefined;
        } else {
            return {
                value: from,
                exists: true,
                // this is lying for now...
                source: 'server'
            };
        }

    }, []);

    const convertedSnapshotSubscriber = React.useMemo(() => {
        const snapshotSubscriber = snapshotSubscriberFactory();
        return SnapshotSubscribers.converted<IPersistentPrefs, ISnapshot<IPersistentPrefs>>(snapshotSubscriber, converter);
    }, [converter, snapshotSubscriberFactory]);

    const onError = () => {
        dialogs.confirm({
            type: 'error',
            title: 'Unable to load prefs',
            subtitle: 'We were unable to load prefs. Please restart.',
            onAccept: NULL_FUNCTION
        })
    }
    console.log("FIXME: PrefsContext");

    // FIXME: this is the bug... for some reason, the first time a user starts polar they have no prefs...
    // FIXME: maybe ditch the datastore prefs entirely at this point in favor of a better/new system

    return (
        <PrefsContextProvider id='story'
                              snapshotSubscriber={convertedSnapshotSubscriber}
                              onError={onError}
                              filter={value => {
                                  return value !== undefined
                              }}>

            {props.children}

        </PrefsContextProvider>
    )

});