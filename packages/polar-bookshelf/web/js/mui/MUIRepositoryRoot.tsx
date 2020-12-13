import * as React from "react";
import {FirestoreProvider} from "../../../apps/repository/js/FirestoreProvider";
import {ActiveKeyboardShortcuts} from "../hotkeys/ActiveKeyboardShortcuts";
import {UserInfoProvider} from "../apps/repository/auth_handler/UserInfoProvider";
import {BrowserTabsStoreProvider} from "../browser_tabs/BrowserTabsStore";
import {MUIAppRoot} from "./MUIAppRoot";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIRepositoryRoot = (props: IProps) => {

    return (
        <MUIAppRoot>
            <BrowserTabsStoreProvider>
                <>
                    <ActiveKeyboardShortcuts/>

                    <FirestoreProvider>
                        <UserInfoProvider>
                            {props.children}
                        </UserInfoProvider>
                    </FirestoreProvider>
                </>
            </BrowserTabsStoreProvider>
        </MUIAppRoot>
    );

};

MUIRepositoryRoot.displayName='MUIRepositoryRoot';