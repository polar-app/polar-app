import React from "react";
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

interface IProps {
    readonly children: JSX.Element;
}

const StoreBinder = (props: IProps) => {

    return (
        <FolderSidebarStoreContext.Provider value={useAnnotationRepoSidebarTagStoreStore}>
            <FolderSidebarCallbacksContext.Provider value={useAnnotationRepoSidebarTagStoreCallbacks}>
                {props.children}
            </FolderSidebarCallbacksContext.Provider>
        </FolderSidebarStoreContext.Provider>
    );

}

export const AnnotationRepoSidebarTagStore = (props: IProps) => {

    return (
        <AnnotationRepoSidebarTagStoreProvider>
            <StoreBinder>
                {props.children}
            </StoreBinder>
        </AnnotationRepoSidebarTagStoreProvider>
    )

}
