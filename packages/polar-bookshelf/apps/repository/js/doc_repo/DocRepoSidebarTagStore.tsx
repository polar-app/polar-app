import React from "react";
import {DocRepoBlocksFolderSidebarStoreProvider} from "../folder_sidebar/BlocksFolderSidebarStore";
import {
    createFolderSidebarStore,
    FolderSidebarCallbacksContext,
    FolderSidebarStoreContext
} from "../folder_sidebar/FolderSidebarStore";

export const [DocRepoSidebarTagStoreProvider, useDocRepoSidebarTagStoreStore, useDocRepoSidebarTagStoreCallbacks] =
    createFolderSidebarStore('doc_repo');

interface IProps {
    readonly children: JSX.Element;
}

const StoreBinder = (props: IProps) => {

    return (
        <FolderSidebarStoreContext.Provider value={useDocRepoSidebarTagStoreStore}>
            <FolderSidebarCallbacksContext.Provider value={useDocRepoSidebarTagStoreCallbacks}>
                {props.children}
            </FolderSidebarCallbacksContext.Provider>
        </FolderSidebarStoreContext.Provider>

    );

}

export const DocRepoSidebarTagStore = (props: IProps) => {

    return (
        <DocRepoSidebarTagStoreProvider>
            <StoreBinder>
                <DocRepoBlocksFolderSidebarStoreProvider>
                    {props.children}
                </DocRepoBlocksFolderSidebarStoreProvider>
            </StoreBinder>
        </DocRepoSidebarTagStoreProvider>
    )

}
