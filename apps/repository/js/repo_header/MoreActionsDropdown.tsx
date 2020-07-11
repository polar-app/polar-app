import {MUIMenu} from "../../../../web/js/mui/menu/MUIMenu";
import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import * as React from "react";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { AppRuntime } from "polar-shared/src/util/AppRuntime";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export const MoreActionsDropdown = React.memo(() => {

    const isElectron = AppRuntime.isElectron();

    return (
        <MUIMenu caret
                 placement="bottom-end"
                 button={{
                     icon: <MoreVertIcon/>,
                     size: 'small'
                 }}>

            <div>
                {isElectron && (
                    <MUIMenuItem text="Start Anki Sync"
                                 onClick={NULL_FUNCTION}/>)}
            </div>

        </MUIMenu>
    );
});
