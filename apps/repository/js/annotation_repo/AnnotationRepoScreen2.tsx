import * as React from 'react';
import {FixedNav} from '../FixedNav';
import {RepoFooter} from "../repo_footer/RepoFooter";
import {Link} from "react-router-dom";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {FloatingActionButton} from "../../../../web/js/ui/mobile/FloatingActionButton";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";
import Paper from "@material-ui/core/Paper";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import {FolderSidebar2} from "../folders/FolderSidebar2";
import {AnnotationListView2} from "./AnnotationListView2";
import {AnnotationRepoFilterBar2} from "./AnnotationRepoFilterBar2";
import {AnnotationRepoGlobalHotKeys} from './AnnotationRepoGlobalHotKeys';
import {AnnotationRepoTable2} from "./AnnotationRepoTable2";
import {AnnotationInlineViewer2} from "./AnnotationInlineViewer2";
import {StartReviewDropdown} from "./filter_bar/StartReviewDropdown";

namespace main {

    export const Phone = () => (
        <DockLayout dockPanels={[
            {
                id: 'dock-panel-center',
                type: 'grow',
                component: <AnnotationListView2/>,
            },
        ]}/>
    );

    export const Tablet = () => (
        <DockLayout dockPanels={[
            {
                id: 'dock-panel-center',
                type: 'fixed',
                component: <AnnotationRepoTable2 />,
                width: 400
            },
            {
                id: 'dock-panel-right',
                type: 'grow',
                component: <AnnotationInlineViewer2 />
            }
        ]}/>
    );

    export const Desktop = () => (
        <DockLayout dockPanels={[
            {
                id: 'dock-panel-left',
                type: 'fixed',
                style: {
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                },
                component: <FolderSidebar2 />,
                width: 300
            },
            {
                id: 'dock-panel-center',
                type: 'fixed',
                style: {
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                },
                component:
                    <Paper square
                           elevation={0}
                           style={{
                               flexGrow: 1,
                               display: 'flex',
                               flexDirection: 'column',
                               minHeight: 0
                           }}>
                        <AnnotationRepoTable2/>
                    </Paper>,
                width: 450
            },
            {
                id: 'dock-panel-right',
                type: 'grow',
                style: {
                    display: 'flex'
                },
                component:
                    <Paper square
                           elevation={0}
                           style={{flexGrow: 1, display: 'flex'}}>
                        <AnnotationInlineViewer2 />
                    </Paper>

            }
        ]}/>
    );

}

namespace screen {

    export const Handheld = () => {

        return (

            <FixedNav id="doc-repository"
                      className="annotations-view">

                <FixedNav.Body>
                    <Paper square
                           elevation={0}
                           style={{
                               flexGrow: 1,
                               display: 'flex',
                               flexDirection: 'column',
                               minHeight: 0
                           }}>

                        {/*<Router onCreateReviewer={mode => props.onCreateReviewer(mode)}*/}
                        {/*        persistenceLayerProvider={props.persistenceLayerProvider}*/}
                        {/*        {...props}/>*/}

                        <Link to={{pathname: '/annotations', hash: '#start-review'}}>

                            <FloatingActionButton style={{
                                marginBottom: '60px',
                                marginRight: '20px'
                            }}
                                                  icon="fas fa-graduation-cap"/>

                        </Link>

                        <DeviceRouter phone={<main.Phone />}
                                      tablet={<main.Tablet />}/>

                    </Paper>
                </FixedNav.Body>

                <FixedNav.Footer>
                    <RepoFooter/>
                </FixedNav.Footer>

            </FixedNav>

        );
    };

    export const Desktop = () => (

        <FixedNav id="doc-repository"
                  className="annotations-view">

            <header>

                <MUIPaperToolbar id="header-filter"
                                 padding={1}
                                 borderBottom>

                    <div style={{
                            display: 'flex',
                            alignItems: 'center'
                         }}>

                        {/*FIXME add this again*/}
                        <StartReviewDropdown />

                        <div style={{
                                 flexGrow: 1,
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'flex-end'
                             }}>
                            <AnnotationRepoFilterBar2/>
                        </div>

                    </div>

                </MUIPaperToolbar>

            </header>

            {/*FIXME: add this again*/}
            {/*<Router onCreateReviewer={mode => props.onCreateReviewer(mode)}*/}
            {/*        {...props}/>*/}

            <AnnotationRepoGlobalHotKeys/>
            
            <main.Desktop />

            <RepoFooter/>

        </FixedNav>

    );

}

export const AnnotationRepoScreen2 = React.memo(() => (
    <DeviceRouter desktop={<screen.Desktop/>}
                  handheld={<screen.Handheld/>}/>
));
