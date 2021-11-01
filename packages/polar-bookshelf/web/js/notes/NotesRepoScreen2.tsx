import React from "react";
import useTheme from "@material-ui/core/styles/useTheme";
import isEqual from "react-fast-compare";
import {DocRepoTable2} from "../../../apps/repository/js/doc_repo/DocRepoTable2";
import {DockLayout} from "../ui/doc_layout/DockLayout";
import {FolderSidebar2} from "../../../apps/repository/js/folders/FolderSidebar2";
import {FixedNav} from "../../../apps/repository/js/FixedNav";
import {DeviceRouter} from "../ui/DeviceRouter";
import {SideCar} from "../sidenav/SideNav";
import {AddContent} from "../../../apps/repository/js/ui/AddContentButton";

namespace main {

    export const Documents = React.memo(() => (
        <DocRepoTable2/>
    ));

    // <FolderSidebar2/>

    export const Folders = React.memo(() => (
        <div></div>
    ));

}

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

export const NotesRepoScreen2 = React.memo(function NotesRepoScreen2() {

    return (

        <>

            <FixedNav id="doc-repository">

                <DeviceRouter handheld={<devices.PhoneAndTablet/>}
                              desktop={<devices.Desktop/>}/>
            </FixedNav>

        </>
    )

}, isEqual);

