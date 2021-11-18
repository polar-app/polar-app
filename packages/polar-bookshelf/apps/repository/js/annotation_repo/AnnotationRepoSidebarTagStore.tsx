import React from "react";
import {AnnotationRepoBlocksFolderSidebarStoreProvider} from "../folder_sidebar/BlocksFolderSidebarStore";
import {
    createFolderSidebarStore,
    FolderSidebarCallbacksContext,
    FolderSidebarStoreContext
} from "../folder_sidebar/FolderSidebarStore";

export const [
    AnnotationRepoSidebarTagStoreProvider,
    useAnnotationRepoSidebarTagStoreStore,
    useAnnotationRepoSidebarTagStoreCallbacks
] = createFolderSidebarStore('annotation_repo');

const StoreBinder: React.FC = (props) => {

    return (
        <FolderSidebarStoreContext.Provider value={useAnnotationRepoSidebarTagStoreStore}>
            <FolderSidebarCallbacksContext.Provider value={useAnnotationRepoSidebarTagStoreCallbacks}>
                {props.children}
            </FolderSidebarCallbacksContext.Provider>
        </FolderSidebarStoreContext.Provider>
    );

}

export const AnnotationRepoSidebarTagStore: React.FC = (props) => {

    return (
        <AnnotationRepoSidebarTagStoreProvider>
            <StoreBinder>
                <AnnotationRepoBlocksFolderSidebarStoreProvider>
                    {props.children}
                </AnnotationRepoBlocksFolderSidebarStoreProvider>
            </StoreBinder>
        </AnnotationRepoSidebarTagStoreProvider>
    );

};
