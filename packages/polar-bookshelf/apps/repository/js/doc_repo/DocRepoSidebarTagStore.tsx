import React from "react";
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
                {props.children}
            </StoreBinder>
        </DocRepoSidebarTagStoreProvider>
    )

}
