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
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import {useHistory} from "react-router-dom";

export const MoreActionsDropdown = React.memo(() => {

    const isElectron = AppRuntime.isElectron();
    const history = useHistory();

    function onChat() {
        Nav.openLinkWithNewTab('https://discord.gg/GT8MhA6')
    }

    function onForum() {
        Nav.openLinkWithNewTab('https://forum.getpolarized.io')
    }

    function onDocumentation() {
        Nav.openLinkWithNewTab('https://getpolarized.io/docs/')
    }

    function onStartAnkiSync() {
        AnkiSyncClient.start();
    }

    const onLogs = React.useCallback(() => {
        history.push('/logs');
    }, []);

    // - overflow menu: chrome extension,  desktop app (only in webapp),
    // documentation, device (though not sure exactly why that is needed), logs
    // (that's issue logs I assume? otherwise maybe leave out), Chat (aka Discord),
    // Reddit, Twitter

    return (
        <MUIMenu caret
                 placement="bottom-end"
                 button={{
                     icon: <MoreVertIcon/>,
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

                <MUIMenuItem icon={<ViewHeadlineIcon/>}
                             text="Logs"
                             onClick={onLogs}/>

                {isElectron && (
                    <>
                        <Divider/>
                        <MUIMenuItem icon={<SyncIcon/>} text="Start Anki Sync" onClick={onStartAnkiSync}/>
                    </>)}
            </div>

        </MUIMenu>
    );
});
