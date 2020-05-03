import React from "react";
import {createFolderSidebarStore} from "../folder_sidebar/FolderSidebarStore";

export const [DocRepoSidebarTagStoreProvider, useDocRepoSidebarTagStoreStore, useDocRepoSidebarTagStoreCallbacks] =
    createFolderSidebarStore();

interface IProps {
    readonly children: JSX.Element;
}

export const DocRepoSidebarTagStore = (props: IProps) => {

    return (
        <DocRepoSidebarTagStoreProvider>
            {props.children}
        </DocRepoSidebarTagStoreProvider>
    )

}
