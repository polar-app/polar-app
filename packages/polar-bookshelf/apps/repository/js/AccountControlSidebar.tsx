import React from 'react';
import {RightSidebar} from "../../../web/js/ui/motion/RightSidebar";
import {AccountControl} from "../../../web/js/ui/cloud_auth/AccountControl";
import {UserInfo} from "../../../web/js/apps/repository/auth_handler/AuthHandler";
import {DeviceRouter} from "../../../web/js/ui/DeviceRouter";
import {PersistenceLayerProvider} from "../../../web/js/datastore/PersistenceLayer";
import {UserInfoDataLoader} from "./persistence_layer/UserInfoDataLoader";
import {PersistenceLayerController} from "../../../web/js/datastore/PersistenceLayerManager";
import {AccountActions} from "../../../web/js/accounts/AccountActions";

interface AccountInfoProps extends AccountControlSidebarProps {
    readonly userInfo: UserInfo | undefined;
    readonly persistenceLayerController: PersistenceLayerController;
}

const AccountInfo = (props: AccountInfoProps) => {

    const onLogout = () => AccountActions.logout(props.persistenceLayerController);

    if (props.userInfo) {
        return <AccountControl {...props}
                               userInfo={props.userInfo}
                               onLogout={() => onLogout()}/>;
    } else {
        return <h2>Please Login</h2>;
    }

};

interface AccountControlSidebarProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
}

const AccountDataLoader = (props: AccountControlSidebarProps) => (

    <UserInfoDataLoader persistenceLayerProvider={props.persistenceLayerProvider}
                        render={userInfo => (
                            <div className="p-2">
                                <AccountInfo {...props} userInfo={userInfo}/>
                            </div>
                        )}/>
);

namespace devices {

    const onClose = () => window.history.back();

    export const Phone = (props: AccountControlSidebarProps) => (
        <RightSidebar onClose={() => onClose()} fullscreen={true}>
            <AccountDataLoader {...props}/>
        </RightSidebar>
    );

    export const TabletAndDesktop = (props: AccountControlSidebarProps) => (
        <RightSidebar onClose={() => onClose()}>
            <AccountDataLoader {...props}/>
        </RightSidebar>
    );

}

// FIXME: mui this needs to be a swipable drawer...
export const AccountControlSidebar = (props: AccountControlSidebarProps) => (

    <DeviceRouter phone={<devices.Phone {...props}/>}
                  tablet={<devices.TabletAndDesktop {...props}/>}
                  desktop={<devices.TabletAndDesktop {...props}/>}/>

);

