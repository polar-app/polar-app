import React from "react";
import {Divider} from "@material-ui/core";
import {SideNavInitializer} from "../../../web/js/sidenav/SideNavInitializer";
import {SideNav} from "../../../web/js/sidenav/SideNav";
import {DeviceRouters} from "../../../web/js/ui/DeviceRouter";
import {MobileNav} from "../../../web/js/MobileNav";


export const Nav = () => {
    return (
        <>
            <DeviceRouters.NotPhone>
                <>
                    <SideNav />
                    <SideNavInitializer />
                    <Divider orientation="vertical"/>
                </>
            </DeviceRouters.NotPhone>
            <DeviceRouters.Phone>
                <MobileNav />
            </DeviceRouters.Phone>
        </>
    );
};
