import React from 'react';
import {PersistenceLayerWatcher} from "./PersistenceLayerWatcher";
import {UserTagsDataLoader} from "./UserTagsDataLoader";
import {PersistenceLayerManager} from "../../../../web/js/datastore/PersistenceLayerManager";
import {ListenablePersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {Tag} from "polar-shared/src/tags/Tags";
import {
    TagDescriptor,
    TagDescriptors
} from "polar-shared/src/tags/TagDescriptors";
import {RepoDataLoader} from "./RepoDataLoader";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {
    createContextMemo,
    useContextMemo
} from "../../../../web/js/react/ContextMemo";
import { PersistenceLayerMutator } from './PersistenceLayerMutator';
import {Provider} from "polar-shared/src/util/Providers";

export interface ITags {

    readonly userTagsProvider: () => ReadonlyArray<Tag> | undefined;
    readonly docTagsProvider: () => ReadonlyArray<TagDescriptor> | undefined;
    readonly annotationTagsProvider: () => ReadonlyArray<TagDescriptor> | undefined;
    readonly tagsProvider: () => ReadonlyArray<TagDescriptor>;
}

export interface IPersistence extends ITags {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly persistenceLayerMutator: PersistenceLayerMutator;
}


export const PersistenceContext = createContextMemo<IPersistence | undefined>(undefined);
export const TagsContext = createContextMemo<ITags | undefined>(undefined);

export function usePersistenceContext() {
    return useContextMemo(PersistenceContext);
}

export function useTagsContext() {
    return useContextMemo(TagsContext);
}

export type TagsType = 'documents' | 'annotations';

export interface IProps {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerManager: PersistenceLayerManager;

    /**
     * The type of tagsProvider to build based on whether we're working with
     * documents or annotations.
     */
    readonly tagsType: TagsType;

    readonly render: (props: DocRepoRenderProps) => React.ReactElement;
}

/**
 * Main props for any app that's using the full state of our app
 */
export interface DocRepoRenderProps {
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly docTags: () => ReadonlyArray<TagDescriptor>;
    readonly annotationTags: () => ReadonlyArray<TagDescriptor>;
    readonly userTags: () => ReadonlyArray<Tag>;
}


const RepoDocMetaManagerContext = React.createContext<RepoDocMetaManager>(null!);
const TagsProviderContext = React.createContext<Provider<ReadonlyArray<Tag>>>(() =>[]);

export const useRepoDocMetaManager = () => React.useContext(RepoDocMetaManagerContext);
export const useTagsProvider = () => React.useContext(TagsProviderContext);

export const PersistenceLayerApp = (props: IProps) => {

    return (
        <RepoDocMetaManagerContext.Provider value={props.repoDocMetaManager}>
            <PersistenceLayerWatcher
                persistenceLayerManager={props.persistenceLayerManager}
                render={persistenceLayerProvider =>
                    <RepoDataLoader repoDocMetaLoader={props.repoDocMetaLoader}
                                    repoDocMetaManager={props.repoDocMetaManager}
                                    render={(appTags) =>
                                        <UserTagsDataLoader
                                            persistenceLayerProvider={persistenceLayerProvider}
                                            render={userTags => {

                                                const {repoDocMetaManager} = props;

                                                const docTags = () => TagDescriptors.merge(appTags?.docTags(), userTags);
                                                const annotationTags = () => TagDescriptors.merge(appTags?.annotationTags(), userTags);

                                                const tagsProvider = props.tagsType === 'documents' ? docTags : annotationTags;

                                                const persistenceLayerMutator = new PersistenceLayerMutator(repoDocMetaManager,
                                                                                                            persistenceLayerProvider,
                                                                                                            tagsProvider);

                                                const persistenceContext: IPersistence = {
                                                    repoDocMetaLoader: props.repoDocMetaLoader,
                                                    repoDocMetaManager: props.repoDocMetaManager,
                                                    persistenceLayerProvider,
                                                    userTagsProvider: () => userTags,
                                                    docTagsProvider: docTags,
                                                    annotationTagsProvider: annotationTags,
                                                    tagsProvider,
                                                    persistenceLayerMutator
                                                }
                                                const tagsContext: ITags = {
                                                    userTagsProvider: () => userTags,
                                                    docTagsProvider: docTags,
                                                    annotationTagsProvider: annotationTags,
                                                    tagsProvider
                                                }

                                                const docRepoRenderProps: DocRepoRenderProps = {
                                                    persistenceLayerProvider,
                                                    docTags,
                                                    annotationTags,
                                                    userTags: () => userTags || []
                                                }

                                                return (
                                                    <PersistenceContext.Provider value={persistenceContext}>
                                                        <TagsContext.Provider value={tagsContext}>
                                                            <TagsProviderContext.Provider value={tagsProvider}>
                                                                {props.render(docRepoRenderProps)}
                                                            </TagsProviderContext.Provider>
                                                        </TagsContext.Provider>
                                                    </PersistenceContext.Provider>
                                                );

                                            }}/>

                                    }/>

                }/>
        </RepoDocMetaManagerContext.Provider>
    );

}
