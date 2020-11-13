import {
    createCachedSnapshotSubscriberContext,
    ISnapshot
} from "../../../../web/js/snapshots/CachedSnapshotSubscriberContext";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import * as React from "react";
import {usePrefsSnapshotSubscriberFactory} from "./PrefsHook";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {SnapshotConverter, SnapshotSubscribers} from "polar-shared/src/util/Snapshots";

export const [PrefsContextProvider, usePrefsContext] = createCachedSnapshotSubscriberContext<PersistentPrefs>();

interface IProps {
    readonly children: JSX.Element | React.ReactNode;
}

export const PrefsContext = React.memo((props: IProps) => {

    const snapshotSubscriberFactory = usePrefsSnapshotSubscriberFactory();
    const dialogs = useDialogManager();

    const converter: SnapshotConverter<PersistentPrefs, ISnapshot<PersistentPrefs>> = React.useCallback((from) => {

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
        return SnapshotSubscribers.converted<PersistentPrefs, ISnapshot<PersistentPrefs>>(snapshotSubscriber, converter);
    }, [converter, snapshotSubscriberFactory]);

    const onError = () => {
        dialogs.confirm({
            type: 'error',
            title: 'Unable to load prefs',
            subtitle: 'We were unable to load prefs. Please restart.',
            onAccept: NULL_FUNCTION
        })
    }

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