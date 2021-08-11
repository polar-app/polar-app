import {DocRepoScreen2} from "../../../../apps/repository/js/doc_repo/DocRepoScreen2";
import {DocRepoSidebarTagStore} from "../../../../apps/repository/js/doc_repo/DocRepoSidebarTagStore";
import React from "react";
import {DeviceRouters} from "../../ui/DeviceRouter";
import {DefaultScreenMobile} from "./DefaultScreenMobile";

export const DefaultScreen = () => {
    return (
        <>
            <DeviceRouters.Phone>
                <DefaultScreenMobile />
            </DeviceRouters.Phone>

            <DeviceRouters.NotPhone>
                <DocRepoSidebarTagStore>
                    <DocRepoScreen2/>
                </DocRepoSidebarTagStore>
            </DeviceRouters.NotPhone>
        </>
    );
};
