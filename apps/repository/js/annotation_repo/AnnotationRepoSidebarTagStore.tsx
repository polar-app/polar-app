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
] = createFolderSidebarStore();

interface IProps {
    readonly children: JSX.Element;
}

const StoreBinder = (props: IProps) => {

    const callbacks = useAnnotationRepoSidebarTagStoreCallbacks();

    return (
        <FolderSidebarStoreContext.Provider value={useAnnotationRepoSidebarTagStoreStore}>
            <FolderSidebarCallbacksContext.Provider value={callbacks}>
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
