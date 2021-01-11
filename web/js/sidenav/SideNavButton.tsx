import * as React from "react";
import {TabDescriptor} from "./SideNavStore";
import {SideNavCurrentTabContext} from "./SideNavContextMenu";
import {SideNavButtonWithIcon} from "./SideNavButtonWithIcon";
import {SideNavContextMenuProvider} from "./SideNav";

interface ISideNavButtonProps {
    readonly tab: TabDescriptor;
}

const WithContext = React.memo((props: ISideNavButtonProps) => {

    const {tab} = props;

    return (
        <SideNavButtonWithIcon tab={tab}/>
    );

});

export const SideNavButton = React.memo((props: ISideNavButtonProps) => {

    const {tab} = props;

    return (
        <>
            <SideNavCurrentTabContext.Provider value={{id: tab.id}}>
                <SideNavContextMenuProvider>
                    <WithContext tab={tab}/>
                </SideNavContextMenuProvider>
            </SideNavCurrentTabContext.Provider>
        </>
    );

});
