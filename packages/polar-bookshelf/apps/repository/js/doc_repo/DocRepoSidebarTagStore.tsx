import React from "react";
import {
    createFolderSidebarStore,
    FolderSidebarCallbacksContext,
    FolderSidebarStoreContext
} from "../folder_sidebar/FolderSidebarStore";

export const [DocRepoSidebarTagStoreProvider, useDocRepoSidebarTagStoreStore, useDocRepoSidebarTagStoreCallbacks] =
    createFolderSidebarStore('doc_repo');

const StoreBinder: React.FC = (props) => {

    return (
        <FolderSidebarStoreContext.Provider value={useDocRepoSidebarTagStoreStore}>
            <FolderSidebarCallbacksContext.Provider value={useDocRepoSidebarTagStoreCallbacks}>
                {props.children}
            </FolderSidebarCallbacksContext.Provider>
        </FolderSidebarStoreContext.Provider>

    );

}

export const DocRepoSidebarTagStore: React.FC = (props) => {

    return (
        <DocRepoSidebarTagStoreProvider>
            <StoreBinder>
                {props.children}
            </StoreBinder>
        </DocRepoSidebarTagStoreProvider>
    )

}
