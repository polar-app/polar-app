import {MUIMenu} from "../../../../web/js/mui/menu/MUIMenu";
import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import * as React from "react";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {AppRuntime} from "polar-shared/src/util/AppRuntime";
import {AnkiSyncClient} from "../../../../web/js/controller/AnkiSyncClient";
import Divider from "@material-ui/core/Divider";
import {Nav} from "../../../../web/js/ui/util/Nav";
import SyncIcon from '@material-ui/icons/Sync';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import {FADiscordIcon} from "../../../../web/js/mui/MUIFontAwesome";
import ForumIcon from '@material-ui/icons/Forum';
import {IconWithColor} from "../../../../web/js/ui/IconWithColor";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useLinkLoader} from "../../../../web/js/ui/util/LinkLoaderHook";

export const MoreActionsDropdown = React.memo(function MoreActionsDropdown() {

    const isElectron = AppRuntime.isElectron();
    const dialogs = useDialogManager();
    const linkLoader = useLinkLoader();

    function onChat() {
        Nav.openLinkWithNewTab('https://discord.gg/GT8MhA6')
    }

    function onForum() {
        Nav.openLinkWithNewTab('https://forum.getpolarized.io')
    }

    function onDocumentation() {
        Nav.openLinkWithNewTab('https://getpolarized.io/docs/')
    }

    const onStartAnkiSync = React.useCallback(() => {

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

    // - overflow menu: chrome extension,  desktop app (only in webapp),
    // documentation, device (though not sure exactly why that is needed), logs
    // (that's issue logs I assume? otherwise maybe leave out), Chat (aka Discord),
    // Reddit, Twitter

    return (
        <MUIMenu caret
                 placement="bottom-end"
                 button={{
                     icon: (
                         <IconWithColor color="text.secondary" Component={MoreVertIcon}/>
                     ),
                     size: 'large'
                 }}>

            <div>

                <MUIMenuItem icon={<FADiscordIcon/>}
                             text="Chat with Polar Community"
                             onClick={onChat}/>

                <MUIMenuItem icon={<ForumIcon/>}
                             text="Forum"
                             onClick={onForum}/>

                <MUIMenuItem icon={<LibraryBooksIcon/>}
                             text="Documentation"
                             onClick={onDocumentation}/>

                <Divider/>
                <MUIMenuItem icon={<SyncIcon/>} text="Start Anki Sync" onClick={onStartAnkiSync}/>
            </div>

        </MUIMenu>
    );
});
