import * as React from 'react';
import { useSideNavStore } from '../../../../web/js/sidenav/SideNavStore';

export const SwitchScreen = () => {
    const {tabs, activeTab} = useSideNavStore(['tabs', 'activeTab']);
    console.log(tabs);
    console.log(activeTab);
    
    return (
        <>
        </>
    );
}