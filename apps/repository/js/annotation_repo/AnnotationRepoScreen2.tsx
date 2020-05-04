import * as React from 'react';
import {RepoDocMetaUpdater} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {FixedNav} from '../FixedNav';
import {Tag} from 'polar-shared/src/tags/Tags';
import {RepoFooter} from "../repo_footer/RepoFooter";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {Link} from "react-router-dom";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {FloatingActionButton} from "../../../../web/js/ui/mobile/FloatingActionButton";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";
import Paper from "@material-ui/core/Paper";
import {MUIPaperToolbar} from "../../../../web/spectron0/material-ui/MUIPaperToolbar";
import {FolderSidebar2} from "../folders/FolderSidebar2";
import {AnnotationListView2} from "./AnnotationListView2";
import {AnnotationPreviewView2} from "./AnnotationPreviewView2";
import {RepoHeader2} from "../repo_header/RepoHeader2";
import {AnnotationRepoFilterBar2} from "./AnnotationRepoFilterBar2";
import { AnnotationRepoKeyBindings } from './AnnotationRepoKeyBindings';

interface AnnotationsPreviewProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly repoDocMetaUpdater: RepoDocMetaUpdater;
    readonly repoAnnotation: IDocAnnotation | undefined;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
}

const AnnotationPreview = (props: AnnotationsPreviewProps) => (
    <AnnotationPreviewView2 />
);
//
// interface RouterProps extends main.MainProps {
//     readonly onCreateReviewer: (mode: RepetitionMode) => any;
//     readonly persistenceLayerProvider: PersistenceLayerProvider;
// }

const onClose = () => window.history.back();

// FIXME: add this back in...
//
// const Router = (props: RouterProps) => (
//
//     <Switch location={ReactRouters.createLocationWithHashOnly()}>
//
//         <Route path='#folders'
//                render={() => (
//                    <LeftSidebar onClose={onClose}>
//                        <main.Folders {...props}/>
//                    </LeftSidebar>
//                )}/>
//
//         <Route path='#start-review'
//                render={() => <StartReviewBottomSheet onReading={NULL_FUNCTION} onFlashcards={NULL_FUNCTION}/>}/>
//
//         <Route path='#review-flashcards'
//                component={() => <IndeterminateLoadingModal id="loading-flashcards"
//                                                            provider={() => props.onCreateReviewer('flashcard')}/>}/>
//
//         <Route path='#review-reading'
//                component={() => <IndeterminateLoadingModal id="loading-review"
//                                                            provider={() => props.onCreateReviewer('reading')}/>}/>
//
//     </Switch>
//
// );

namespace main {

    export const Folders = () => (
        <FolderSidebar2 />
    );

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
                component: <AnnotationListView2 />,
                width: 350
            },
            {
                id: 'dock-panel-right',
                type: 'grow',
                // component: <AnnotationPreview2 />
                component: <div>FIXME: disabled for now</div>
            }
        ]}/>
    );

    export const Desktop = () => (
        <DockLayout dockPanels={[
            {
                id: 'dock-panel-left',
                type: 'fixed',
                component: <main.Folders />,
                style: {
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                },
                width: 300
            },
            {
                id: 'dock-panel-center',
                type: 'fixed',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                },
                component:
                    <Paper square
                           elevation={0}
                           style={{flexGrow: 1, display: 'flex'}}>
                        <AnnotationListView2 />
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
                        <AnnotationPreviewView2 />
                    </Paper>

            }
        ]}/>
    );

}

namespace screen {

    export const PhoneAndTablet = () => {

        return (

            <FixedNav id="doc-repository"
                      className="annotations-view">

                <FixedNav.Header>

                    {/*FIXME: this needs right and toggle I think... this is a mobile thing?*/}
                    {/*<RepoHeader right={<FilterBar {...props}/>}*/}
                    {/*            toggle={(*/}
                    {/*                <Link to="#folders">*/}
                    {/*                    <Button color="clear">*/}
                    {/*                        <i className="fas fa-bars"/>*/}
                    {/*                    </Button>*/}
                    {/*                </Link>*/}
                    {/*            )}*/}
                    {/*            persistenceLayerProvider={props.persistenceLayerProvider}*/}
                    {/*            persistenceLayerController={props.persistenceLayerManager}/>*/}

                    <RepoHeader2/>

                </FixedNav.Header>

                <FixedNav.Body>

                    {/*FIXME: add this back in*/}
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
                                  tablet={<main.Tablet />}>

                    </DeviceRouter>

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

                <RepoHeader2/>

                <MUIPaperToolbar id="header-filter"
                                 padding={1}
                                 borderBottom>

                    <div style={{
                            display: 'flex',
                            alignItems: 'center'
                         }}>

                        {/*FIXME add this again*/}
                        {/*<StartReviewDropdown onFlashcards={() => props.onStartReview('flashcard')}*/}
                        {/*                     onReading={() => props.onStartReview('reading')}/>*/}

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
            {/*        persistenceLayerProvider={props.persistenceLayerProvider}*/}
            {/*        {...props}/>*/}

            <AnnotationRepoKeyBindings/>

            <main.Desktop />

            <RepoFooter/>

        </FixedNav>

    );

}

export const AnnotationRepoScreen2 = React.memo(() => (
    <DeviceRouter desktop={<screen.Desktop/>}
                  phone={<screen.PhoneAndTablet/>}/>
));
