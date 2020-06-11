import React from "react";
import {
    createFolderSidebarStore,
    FolderSidebarCallbacksContext,
    FolderSidebarStoreContext
} from "../folder_sidebar/FolderSidebarStore";

export const [DocRepoSidebarTagStoreProvider, useDocRepoSidebarTagStoreStore, useDocRepoSidebarTagStoreCallbacks] =
    createFolderSidebarStore();

interface IProps {
    readonly children: JSX.Element;
}

const StoreBinder = (props: IProps) => {

    const store = useDocRepoSidebarTagStoreStore();
    const callbacks = useDocRepoSidebarTagStoreCallbacks();

    return (
        <FolderSidebarStoreContext.Provider value={store}>
            <FolderSidebarCallbacksContext.Provider value={callbacks}>
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
