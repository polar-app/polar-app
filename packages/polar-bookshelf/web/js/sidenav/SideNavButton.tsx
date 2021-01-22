import * as React from "react";
import {TabDescriptor} from "./SideNavStore";
import {SideNavCurrentTabContext} from "./SideNavContextMenu";
import {SideNavContextMenuProvider} from "./SideNav";
import {SideNavButtonWithAvatar} from "./SideNavButtonWithAvatar";

interface ISideNavButtonProps {
    readonly tab: TabDescriptor;
}

const Button = React.memo((props: ISideNavButtonProps) => {

    const {tab} = props;

    return (
        <SideNavButtonWithAvatar tab={tab}/>
    );

});

export const SideNavButton = React.memo((props: ISideNavButtonProps) => {

    const {tab} = props;

    return (
        <>
            <SideNavCurrentTabContext.Provider value={{tab}}>
                <SideNavContextMenuProvider>
                    <Button tab={tab}/>
                </SideNavContextMenuProvider>
            </SideNavCurrentTabContext.Provider>
        </>
    );

});
