import {MUIMenu} from "../../../../web/js/mui/menu/MUIMenu";
import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import * as React from "react";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {AppRuntime} from "polar-shared/src/util/AppRuntime";
import {AnkiSyncClient} from "../../../../web/js/controller/AnkiSyncClient";

export const MoreActionsDropdown = React.memo(() => {

    const isElectron = AppRuntime.isElectron();

    function onStartAnkiSync() {
        AnkiSyncClient.start();
    }

    return (
        <MUIMenu caret
                 placement="bottom-end"
                 button={{
                     icon: <MoreVertIcon/>,
                     size: 'small'
                 }}>

            <div>
                {isElectron &&
                    <MUIMenuItem text="Start Anki Sync" onClick={onStartAnkiSync}/>}
            </div>

        </MUIMenu>
    );
});
