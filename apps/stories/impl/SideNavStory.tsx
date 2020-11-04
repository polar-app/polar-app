import * as React from 'react';
import {SideNav} from "../../../web/js/sidenav/SideNav";

export const SideNavStory = () => {
    return (
        <div style={{display: 'flex'}}>
            <SideNav/>
            <div style={{flexGrow: 1}}>

            </div>
        </div>
    )
}