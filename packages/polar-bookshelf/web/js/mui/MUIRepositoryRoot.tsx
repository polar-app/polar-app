import * as React from "react";
import {FirestoreProvider} from "../../../apps/repository/js/FirestoreProvider";
import {UserInfoProvider} from "../apps/repository/auth_handler/UserInfoProvider";
import {SideNavStoreProvider} from "../sidenav/SideNavStore";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIRepositoryRoot = React.memo(function MUIRepositoryRoot(props: IProps) {

    return (
        <SideNavStoreProvider>
            <>

                <FirestoreProvider>
                    <UserInfoProvider>
                        <>
                            {props.children}
                        </>
                    </UserInfoProvider>
                </FirestoreProvider>
            </>
        </SideNavStoreProvider>
    );

});
