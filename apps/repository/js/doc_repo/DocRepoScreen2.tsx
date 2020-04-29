import {ListenablePersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {PersistenceLayerController} from "../../../../web/js/datastore/PersistenceLayerManager";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {DocRepoRenderProps} from "../persistence_layer/PersistenceLayerApp";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import React from "react";
import {FixedNav} from "../FixedNav";
import {RepositoryTour} from "../../../../web/js/apps/repository/RepositoryTour";
import {RepoHeader} from "../repo_header/RepoHeader";
import {Link} from "react-router-dom";
import {Button} from "reactstrap";
import {MUIPaperToolbar} from "../../../../web/spectron0/material-ui/MUIPaperToolbar";
import {DocRepoButtonBar} from "./DocRepoButtonBar";
import {DocRepoFilterBar} from "./DocRepoFilterBar";
import {MessageBanner} from "../MessageBanner";
import {DocRepoTableProps} from "./DocRepoTable";
import {RepoDocInfo} from "../RepoDocInfo";
import {DocRepoTableColumnsMap} from "./DocRepoTableColumns";
import {DocRepoTable2} from "../../../../web/spectron0/material-ui/doc_repo_table/DocRepoTable2";
import {FolderSidebar, FoldersSidebarProps} from "../folders/FolderSidebar";
import {Route, Switch} from "react-router";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {LeftSidebar} from "../../../../web/js/ui/motion/LeftSidebar";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";
import { FolderSidebar2 } from "../folders/FolderSidebar2";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import { AddContent } from "../ui/AddContentButton";
import {RepoFooter} from "../repo_footer/RepoFooter";
import isEqual from "react-fast-compare";


namespace main {

    export interface DocumentsProps extends DocRepoTableProps {
        readonly data: ReadonlyArray<RepoDocInfo>;
        readonly columns: DocRepoTableColumnsMap;
        readonly selected: ReadonlyArray<number>;
    }

    export const Documents = React.memo(() => (

        <DocRepoTable2 />

    ));

    export const Folders = React.memo(() => (
        <FolderSidebar2/>
    ));

}

const onClose = () => window.history.back();

const Router = () => (

    <Switch location={ReactRouters.createLocationWithHashOnly()}>

        <Route path='#folders'
               render={React.memo(() => (
                   <LeftSidebar onClose={onClose}>
                       <main.Folders/>
                   </LeftSidebar>
               ))}/>

    </Switch>

);

namespace devices {

    export const PhoneAndTablet = React.memo(() => (
        <main.Documents/>
    ));

    export const Desktop = React.memo(() => (

        <DockLayout dockPanels={[
            {
                id: "dock-panel-left",
                type: 'fixed',
                component: <FolderSidebar2/>,
                width: 300,
                style: {
                    overflow: 'none'
                }
            },
            {
                id: "doc-panel-center",
                type: 'grow',
                component: <main.Documents/>
            }
        ]}/>

    ));

}


interface IProps {

    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;

    readonly persistenceLayerController: PersistenceLayerController;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly tagsProvider: () => ReadonlyArray<TagDescriptor>;

    readonly docRepo: DocRepoRenderProps;

}

export const DocRepoScreen2 = React.memo((props: IProps) => {

    return (

        <FixedNav id="doc-repository">

            <RepositoryTour/>
            <header>

                <RepoHeader toggle={(
                                <Link to="#folders">
                                    <Button color="clear">
                                        <i className="fas fa-bars"/>
                                    </Button>
                                </Link>
                            )}
                            persistenceLayerProvider={props.persistenceLayerProvider}
                            persistenceLayerController={props.persistenceLayerController}/>

                <MUIPaperToolbar id="header-filter"
                                 borderBottom
                                 padding={1}>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>

                        <div className=""
                             style={{
                                 whiteSpace: 'nowrap',
                                 display: 'flex'
                             }}>

                            <DocRepoButtonBar />

                        </div>

                        <div style={{marginLeft: 'auto'}}>

                            <DocRepoFilterBar right={
                                                  <div className="d-none-phone d-none-tablet"
                                                       style={{whiteSpace: 'nowrap', marginTop: 'auto', marginBottom: 'auto'}}>

                                                      {/*<DocRepoTableDropdown id="table-dropdown"*/}
                                                      {/*                      options={Object.values(this.state.columns)}*/}
                                                      {/*                      onSelectedColumns={(selectedColumns) => this.onSelectedColumns(selectedColumns)}/>*/}
                                                  </div>
                                              }
                            />

                        </div>

                    </div>
                </MUIPaperToolbar>

                <MessageBanner/>

            </header>

            <Router/>

            <DeviceRouter phone={<devices.PhoneAndTablet/>}
                          tablet={<devices.PhoneAndTablet/>}
                          desktop={<devices.Desktop/>}/>

            <FixedNav.Footer>

                <DeviceRouter.Handheld>
                    <AddContent.Handheld/>
                </DeviceRouter.Handheld>

                <RepoFooter/>
            </FixedNav.Footer>

        </FixedNav>

    )

}, isEqual);



