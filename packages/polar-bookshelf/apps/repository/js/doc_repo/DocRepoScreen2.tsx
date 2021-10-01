import React from "react";
import useTheme from "@material-ui/core/styles/useTheme";
import {FixedNav} from "../FixedNav";
import {DocRepoTable2} from "./DocRepoTable2";
import {FolderSidebar2} from "../folders/FolderSidebar2";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {AddContent} from "../ui/AddContentButton";
import isEqual from "react-fast-compare";
import {DocRepoScreenRoutedComponents} from "./DocRepoScreenRoutedComponents";
import {SideCar} from "../../../../web/js/sidenav/SideNav";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";

namespace main {

    export const Documents = React.memo(() => (
        <DocRepoTable2/>
    ));

    export const Folders = React.memo(() => (
        <FolderSidebar2/>
    ));

}

const onClose = () => window.history.back();

namespace devices {

    export const PhoneAndTablet = React.memo(() => (
        <>
            <SideCar>
                <main.Folders/>
            </SideCar>
            <main.Documents/>
        </>
    ));

    export const Desktop = React.memo(function Desktop() {

        const theme = useTheme();

        const AddContentHeader = () => (
            <AddContent.Desktop style={{
                                    flexGrow: 1,
                                    marginTop: theme.spacing(1),
                                    marginBottom: theme.spacing(1)
                                }}/>
        );

        return (

            <DockLayout.Root dockPanels={[
                {
                    id: "dock-panel-left",
                    type: 'fixed',
                    // side: 'left',
                    component: <FolderSidebar2 header={<AddContentHeader/>}/>,
                    width: 300,
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        overflow: 'none'
                    }
                },
                {
                    id: "doc-panel-center",
                    type: 'grow',
                    component: <main.Documents/>
                }
            ]}>
                <DockLayout.Main />
            </DockLayout.Root>

        );

    });

}

export const DocRepoScreen2 = React.memo(() => {

    return (

        <>

            <FixedNav id="doc-repository">

                <DocRepoScreenRoutedComponents/>

                <header>

                </header>

                <DeviceRouter handheld={<devices.PhoneAndTablet/>}
                              desktop={<devices.Desktop/>}/>
            </FixedNav>

        </>
    )

}, isEqual);

DocRepoScreen2.displayName='DocRepoScreen2';

