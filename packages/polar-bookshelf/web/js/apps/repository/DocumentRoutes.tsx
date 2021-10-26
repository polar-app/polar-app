import {RepoDocMetaLoader} from "../../../../apps/repository/js/RepoDocMetaLoader";
import {RepoDocMetaManager} from "../../../../apps/repository/js/RepoDocMetaManager";
import React from "react";
import {ListenablePersistenceLayerProvider} from "../../datastore/PersistenceLayer";
import {PersistenceLayerManager} from "../../datastore/PersistenceLayerManager";
import {useSideNavStore} from "../../sidenav/SideNavStore";
import {PersistentRoute} from "./PersistentRoute";
import {deepMemo} from "../../react/ReactUtils";
import {
    PersistenceLayerApp,
    PersistenceLayerContext
} from "../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {UserTagsProvider} from "../../../../apps/repository/js/persistence_layer/UserTagsProvider2";
import {AnnotationSidebarStoreProvider} from "../../../../apps/doc/src/AnnotationSidebarStore";
import {DocMetaContextProvider} from "../../annotation_sidebar/DocMetaContextProvider";
import {DocViewerStore} from "../../../../apps/doc/src/DocViewerStore";
import {DocViewerDocMetaLookupContextProvider} from "../../../../apps/doc/src/DocViewerDocMetaLookupContextProvider";
import {DocFindStore} from "../../../../apps/doc/src/DocFindStore";
import {DocViewer} from "../../../../apps/doc/src/DocViewer";

interface IDocumentsScreensProps {
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerManager: PersistenceLayerManager;
}

const SidenavDocuments: React.FC<IDocumentsScreensProps> = (props) => {

    const { tabs } = useSideNavStore(['tabs']);

    return (
        <>
            {tabs.map(tab => {

                return (
                    <PersistentRoute key={`doc-${tab.id}`}
                                     exact
                                     strategy={tab.type === 'pdf' ? 'display' : 'visibility'}
                                     path={tab.url}>
                         <RepositoryDocViewerScreen {...props}/>
                    </PersistentRoute>
                );

            })}
        </>
    );
};

export const DocumentRoutes: React.FC<IDocumentsScreensProps> = React.memo(function DocumentScreens(props) {
    return <SidenavDocuments {...props} />;
});


interface RepositoryDocViewerScreenProps {
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerManager: PersistenceLayerManager;

}

export const RepositoryDocViewerScreen = deepMemo(function RepositoryDocViewerScreen(props: RepositoryDocViewerScreenProps) {

    return (
        <PersistenceLayerContext.Provider value={{persistenceLayerProvider: props.persistenceLayerProvider}}>
            <PersistenceLayerApp tagsType="documents"
                                 repoDocMetaManager={props.repoDocMetaManager}
                                 repoDocMetaLoader={props.repoDocMetaLoader}
                                 persistenceLayerManager={props.persistenceLayerManager}>
                <AnnotationSidebarStoreProvider>
                    <UserTagsProvider>
                        <DocMetaContextProvider>
                            <DocViewerStore>
                                <DocViewerDocMetaLookupContextProvider>
                                    <DocFindStore>
                                        <DocViewer/>
                                    </DocFindStore>
                                </DocViewerDocMetaLookupContextProvider>
                            </DocViewerStore>
                        </DocMetaContextProvider>
                    </UserTagsProvider>
                </AnnotationSidebarStoreProvider>
            </PersistenceLayerApp>
        </PersistenceLayerContext.Provider>
    );
});

