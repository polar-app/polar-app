import * as React from "react";
import {deepMemo} from "../react/ReactUtils";
import {MUIMenuItem} from "../mui/menu/MUIMenuItem";
import CloseIcon from '@material-ui/icons/Close';
import {TabDescriptor, useSideNavCallbacks } from "./SideNavStore";
import {useLinkLoader} from "../ui/util/LinkLoaderHook";
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

interface ISideNavCurrentTab {
    readonly tab: TabDescriptor;
}

export const SideNavCurrentTabContext = React.createContext<ISideNavCurrentTab>(null!)

function useSideNavCurrentTabContext() {
    return React.useContext(SideNavCurrentTabContext);
}

export const SideNavContextMenu = deepMemo(() => {

    const {removeTab, closeOtherTabs} = useSideNavCallbacks();

    const currentTabContext = useSideNavCurrentTabContext();
    const linkLoader = useLinkLoader();

    const handleOpenDocumentInBrowser = React.useCallback(() => {

        if (currentTabContext) {
            linkLoader(currentTabContext.tab.url, {focus: true, newWindow: true});
        } else {
            console.warn("No current tab context");
        }

    }, [currentTabContext, linkLoader]);

    const closeCurrentTab = React.useCallback(() => {

        if (currentTabContext) {
            removeTab(currentTabContext.tab.id);
        } else {
            console.warn("No current tab context");
        }

    }, [currentTabContext, removeTab]);

    return (
        <>

            <MUIMenuItem text="Open Document in Browser"
                         icon={<OpenInBrowserIcon/>}
                         onClick={handleOpenDocumentInBrowser}/>

            <MUIMenuItem text="Close Document"
                         icon={<CloseIcon/>}
                         onClick={closeCurrentTab}/>

            <MUIMenuItem text="Close Other Documents"
                         icon={<CloseIcon/>}
                         onClick={closeOtherTabs}/>

        </>
    );

});
