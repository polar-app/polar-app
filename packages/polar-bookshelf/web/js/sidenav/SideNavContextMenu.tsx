import * as React from "react";
import {deepMemo} from "../react/ReactUtils";
import {MUIMenuItem} from "../mui/menu/MUIMenuItem";
import CloseIcon from '@material-ui/icons/Close';
import { useSideNavCallbacks } from "./SideNavStore";

interface ISideNavCurrentTab {
    readonly id: number;
}

export const SideNavCurrentTabContext = React.createContext<ISideNavCurrentTab>(null!)

function useSideNavCurrentTabContext() {
    return React.useContext(SideNavCurrentTabContext);
}

export const SideNavContextMenu = deepMemo(() => {

    const {removeTab} = useSideNavCallbacks();

    const currentTabContext = useSideNavCurrentTabContext();

    const closeCurrentTab = React.useCallback(() => {

        if (currentTabContext) {
            removeTab(currentTabContext.id);
        } else {
            console.warn("No current tab context");
        }

    }, [currentTabContext, removeTab]);

    return (
        <>
            <MUIMenuItem text="Close Document"
                         icon={<CloseIcon/>}
                         onClick={closeCurrentTab}/>
        </>
    );

});
