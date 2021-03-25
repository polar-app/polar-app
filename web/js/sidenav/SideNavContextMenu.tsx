import * as React from "react";
import {deepMemo} from "../react/ReactUtils";
import {MUIMenuItem} from "../mui/menu/MUIMenuItem";
import CloseIcon from '@material-ui/icons/Close';
import {TabDescriptor, TabDescriptorInit, TabID, useSideNavCallbacks} from "./SideNavStore";
import {useLinkLoader} from "../ui/util/LinkLoaderHook";
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import {SideNavActivatedContextMenu} from "./SideNavActivatedContextMenu";

interface ISideNavCurrentTab {
    readonly tab: TabDescriptor;
}

export const SideNavCurrentTabContext = React.createContext<ISideNavCurrentTab | undefined>(undefined)

export function useSideNavCurrentTabContext() {
    return React.useContext(SideNavCurrentTabContext);
}

export const SideNavContextMenu = deepMemo(function SideNavContextMenu() {

    const {removeTab, closeOtherTabs, getTabDescriptor} = useSideNavCallbacks();

    const currentTabID = SideNavActivatedContextMenu.get();
    const linkLoader = useLinkLoader();

    const withActivatedTab = React.useCallback((delegate: (tab: TabDescriptor) => void) => {

        if (currentTabID !== undefined) {

            const tab = getTabDescriptor(currentTabID);

            if (tab) {
                delegate(tab);
            }

        } else {
            console.warn("No current tab");
        }

    }, [currentTabID, getTabDescriptor]);

    const handleOpenDocumentInBrowser = React.useCallback(() => {

        withActivatedTab(tab => linkLoader(tab.url, {focus: true, newWindow: true}));

    }, [linkLoader, withActivatedTab]);

    const closeCurrentTab = React.useCallback(() => {

        withActivatedTab(tab => removeTab(tab.id));

    }, [removeTab, withActivatedTab]);

    const handleCloseOtherTabs = React.useCallback(() => {

        withActivatedTab(tab => closeOtherTabs(tab.id));

    }, [closeOtherTabs, withActivatedTab]);

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
                         onClick={handleCloseOtherTabs}/>

        </>
    );

});
