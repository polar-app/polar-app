import React from "react";
import {FixedNav} from "../FixedNav";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import {DocRepoButtonBar} from "./DocRepoButtonBar";
import {DocRepoFilterBar} from "./DocRepoFilterBar";
import {DocRepoTable2} from "./DocRepoTable2";
import {Route, Switch} from "react-router";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {LeftSidebar} from "../../../../web/js/ui/motion/LeftSidebar";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";
import {FolderSidebar2} from "../folders/FolderSidebar2";
import {DeviceRouter, DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import {AddContent} from "../ui/AddContentButton";
import isEqual from "react-fast-compare";
import {DocRepoScreenRoutedComponents} from "./DocRepoScreenRoutedComponents";
import {useHistory} from "react-router-dom";
import useLocationWithHashOnly = ReactRouters.useLocationWithHashOnly;
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {FeedbackButton2} from "../ui/FeedbackButton2";
import Box from "@material-ui/core/Box";
import useTheme from "@material-ui/core/styles/useTheme";

namespace main {

    export const Documents = React.memo(() => (
        <DocRepoTable2/>
    ));

    export const Folders = React.memo(() => (
        <FolderSidebar2/>
    ));

}

const onClose = () => window.history.back();

const Router = () => (

    <Switch location={ReactRouters.createLocationWithHashOnly()}>

        <Route path='#folders'>
            {/*TODO this is used for mobile and is broken under MUI now*/}
            <LeftSidebar onClose={onClose}>
                <main.Folders/>
            </LeftSidebar>
        </Route>

    </Switch>

);

const FolderDrawer = React.memo(() => {

    const location = useLocationWithHashOnly();
    const history = useHistory()

    const open = location.hash === '#folders';

    function handleClose() {
        history.replace({hash: ''});
    }

    function handleOpen() {
        history.push({hash: '#folders'});
    }

    return (
        <SwipeableDrawer
            anchor='left'
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}>
            <main.Folders/>
        </SwipeableDrawer>
    );

});

namespace devices {

    export const PhoneAndTablet = React.memo(() => (
        <>
            <FolderDrawer/>
            <main.Documents/>
        </>
    ));

    export const Desktop = React.memo(() => {

        const theme = useTheme();

        const AddContentHeader = () => (
            <AddContent.Desktop style={{
                                    flexGrow: 1,
                                    marginTop: theme.spacing(1),
                                    marginBottom: theme.spacing(1)
                                }}/>
        );

        return (

            <DockLayout dockPanels={[
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
            ]}/>

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

                <FixedNav.Footer>

                    <DeviceRouter.Handheld>
                        <AddContent.Handheld/>
                    </DeviceRouter.Handheld>

                    <FeedbackButton2/>

                </FixedNav.Footer>

            </FixedNav>

        </>
    )

}, isEqual);

DocRepoScreen2.displayName='DocRepoScreen2';

