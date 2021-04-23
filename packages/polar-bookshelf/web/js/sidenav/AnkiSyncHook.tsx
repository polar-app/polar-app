import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {useLinkLoader} from "../ui/util/LinkLoaderHook";
import * as React from "react";
import {AnkiSyncClient} from "../controller/AnkiSyncClient";
import {AppRuntime} from "polar-shared/src/util/AppRuntime";

export function useAnkiSyncCallback() {

    const dialogs = useDialogManager();
    const linkLoader = useLinkLoader();

    const isElectron = AppRuntime.isElectron();

    return React.useCallback(() => {

        if (isElectron) {
            AnkiSyncClient.start();
        } else {

            dialogs.dialog({
                type: 'warning',
                title: "Anki Sync Requires Desktop",
                acceptText: "Get Desktop App",
                body: (
                    <div>
                        <p>
                            Anki Sync only works with the Polar desktop app.
                        </p>

                        <p>
                            Please download the Polar desktop app to enable syncing to Anki.
                        </p>

                    </div>
                ),
                onAccept: () => linkLoader('https://getpolarized.io/download/', {newWindow: true, focus: true})

            })
        }
    }, [dialogs, isElectron, linkLoader]);

}