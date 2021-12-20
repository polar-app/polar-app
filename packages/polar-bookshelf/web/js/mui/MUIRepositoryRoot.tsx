import * as React from "react";
import {FirestoreProvider} from "../../../apps/repository/js/FirestoreProvider";
import {UserInfoProvider} from "../apps/repository/auth_handler/UserInfoProvider";
import {MUIAppRoot} from "./MUIAppRoot";
import {SideNavStoreProvider} from "../sidenav/SideNavStore";
import {SpacedRepCollectionSnapshotProvider} from "../../../apps/repository/js/reviewer/UseSpacedRepCollectionSnapshot";
import {SpacedRepStatCollectionSnapshotProvider} from "../../../apps/repository/js/reviewer/UseSpacedRepStatCollectionSnapshot";

import LinearProgress from "@material-ui/core/LinearProgress";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIRepositoryRoot = React.memo(function MUIRepositoryRoot(props: IProps) {

    return (
        <MUIAppRoot>
            <SideNavStoreProvider>
                <>

                    <FirestoreProvider>
                        <UserInfoProvider>
                            <SpacedRepCollectionSnapshotProvider fallback={<LinearProgress/>}>
                                <SpacedRepStatCollectionSnapshotProvider fallback={<LinearProgress/>}>
                                    <>
                                        {props.children}
                                    </>
                                </SpacedRepStatCollectionSnapshotProvider>
                            </SpacedRepCollectionSnapshotProvider>
                        </UserInfoProvider>
                    </FirestoreProvider>
                </>
            </SideNavStoreProvider>
        </MUIAppRoot>
    );

});
