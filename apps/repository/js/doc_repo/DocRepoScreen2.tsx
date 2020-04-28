import {ListenablePersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {PersistenceLayerController} from "../../../../web/js/datastore/PersistenceLayerManager";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {DocRepoRenderProps} from "../persistence_layer/PersistenceLayerApp";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import React from "react";
import {useDocRepoStore} from "./DocRepoStore";
import {FixedNav} from "../FixedNav";
import {RepositoryTour} from "../../../../web/js/apps/repository/RepositoryTour";
import {RepoHeader} from "../repo_header/RepoHeader";
import {Link} from "react-router-dom";
import {Button} from "reactstrap";
import {MUIPaperToolbar} from "../../../../web/spectron0/material-ui/MUIPaperToolbar";
import {DocRepoButtonBar} from "./DocRepoButtonBar";
import {DocRepoFilterBar} from "./DocRepoFilterBar";
import {MessageBanner} from "../MessageBanner";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {FilteredTags} from "../FilteredTags";
import {DocRepoTableProps} from "./DocRepoTable";
import {RepoDocInfo} from "../RepoDocInfo";
import {DocRepoTableColumnsMap} from "./DocRepoTableColumns";
import {DocumentRepositoryTableActions} from "../../../../web/spectron0/material-ui/doc_repo_table/DocumentRepositoryTableActions";
import {DocRepoTable2} from "../../../../web/spectron0/material-ui/doc_repo_table/DocRepoTable2";
import {FolderSidebar, FoldersSidebarProps} from "../folders/FolderSidebar";
import {Route, Switch} from "react-router";
import {ReactRouters} from "../../../../web/js/react/router/ReactRouters";
import {LeftSidebar} from "../../../../web/js/ui/motion/LeftSidebar";
import {DockLayout} from "../../../../web/js/ui/doc_layout/DockLayout";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {AddContent} from "../ui/AddContentButton";
import {RepoFooter} from "../repo_footer/RepoFooter";


namespace main {

    export interface DocumentsProps extends DocRepoTableProps {
        readonly data: ReadonlyArray<RepoDocInfo>;
        readonly columns: DocRepoTableColumnsMap;
        readonly selected: ReadonlyArray<number>;
    }

    export const Documents = (props: DocumentsProps) => (

        <DocRepoTable2 />

    );

    export interface FoldersProps extends FoldersSidebarProps {

    }

    export const Folders = (props: FoldersSidebarProps) => (
        <FolderSidebar {...props}/>
    );

}

const onClose = () => window.history.back();

const Router = (props: main.FoldersProps) => (

    <Switch location={ReactRouters.createLocationWithHashOnly()}>

        <Route path='#folders'
               render={() => (
                   <LeftSidebar onClose={onClose}>
                       <main.Folders {...props}/>
                   </LeftSidebar>
               )}/>

    </Switch>

);

namespace devices {

    export interface DeviceProps extends main.DocumentsProps, main.FoldersProps {

    }

    export const PhoneAndTablet = (props: DeviceProps) => (
        <main.Documents {...props}/>
    );

    export const Desktop = (props: DeviceProps) => (

        <DockLayout dockPanels={[
            {
                id: "dock-panel-left",
                type: 'fixed',
                component: <FolderSidebar {...props}/>,
                width: 300,
                style: {
                    overflow: 'none'
                }
            },
            {
                id: "doc-panel-center",
                type: 'grow',
                component: <main.Documents {...props}/>
            }
        ]}/>

    );

}


interface IProps {

    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;

    readonly persistenceLayerController: PersistenceLayerController;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly tagsProvider: () => ReadonlyArray<TagDescriptor>;

    readonly docRepo: DocRepoRenderProps;

}

export const DocRepoScreen2 = (props: IProps) => {

    const {tagsProvider} = props;

    const deviceProps = {

    };

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

            <DocRepoTable2/>

            {/*<Router {...deviceProps}/>*/}

            {/*<DeviceRouter phone={<devices.PhoneAndTablet {...deviceProps}/>}*/}
            {/*              tablet={<devices.PhoneAndTablet {...deviceProps}/>}*/}
            {/*              desktop={<devices.Desktop {...deviceProps}/>}/>*/}

            {/*<FixedNav.Footer>*/}

            {/*    <DeviceRouter.Handheld>*/}
            {/*        <AddContent.Handheld/>*/}
            {/*    </DeviceRouter.Handheld>*/}

            {/*    <RepoFooter/>*/}
            {/*</FixedNav.Footer>*/}

        </FixedNav>

    )

}



