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
import {PersistenceLayerMutator} from './PersistenceLayerMutator';
import {Provider} from "polar-shared/src/util/Providers";
import {
    BaseDocMetaLookupContext,
    DocMetaLookupContext,
    IDocMetaLookupContext
} from "../../../../web/js/annotation_sidebar/DocMetaLookupContextProvider";
import {IDStr} from "polar-shared/src/util/Strings";

export interface ITagsContext {

    // readonly userTagsProvider: () => ReadonlyArray<Tag> | undefined;
    // readonly docTagsProvider: () => ReadonlyArray<TagDescriptor> | undefined;
    // readonly annotationTagsProvider: () => ReadonlyArray<TagDescriptor> | undefined;
    readonly tagsProvider: () => ReadonlyArray<Tag>;
}

export interface ITagDescriptorsContext {

    // readonly userTagsProvider: () => ReadonlyArray<Tag> | undefined;
    // readonly docTagsProvider: () => ReadonlyArray<TagDescriptor> | undefined;
    // readonly annotationTagsProvider: () => ReadonlyArray<TagDescriptor> | undefined;
    readonly tagDescriptorsProvider: () => ReadonlyArray<TagDescriptor>;
}

export interface IPersistenceLayerContext {
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
}

export interface IPersistenceContext extends ITagsContext, IPersistenceLayerContext {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerMutator: PersistenceLayerMutator;
}

export const PersistenceLayerContext = createContextMemo<IPersistenceLayerContext>(null!);
export const PersistenceContext = createContextMemo<IPersistenceContext>(null!);
export const TagsContext = createContextMemo<ITagsContext>(null!);
export const TagDescriptorsContext = createContextMemo<ITagDescriptorsContext>(null!);

export function usePersistenceContext() {
    return useContextMemo(PersistenceContext);
}

export function usePersistenceLayerContext() {
    return useContextMemo(PersistenceLayerContext);
}

export function useTagsContext() {
    return useContextMemo(TagsContext);
}

export function useTagDescriptorsContext() {
    return useContextMemo(TagDescriptorsContext);
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


const RepoDocMetaLoaderContext = React.createContext<RepoDocMetaLoader>(null!);
const RepoDocMetaManagerContext = React.createContext<RepoDocMetaManager>(null!);
const TagsProviderContext = React.createContext<Provider<ReadonlyArray<Tag>>>(() =>[]);

export const useRepoDocMetaLoader = () => React.useContext(RepoDocMetaLoaderContext);
export const useRepoDocMetaManager = () => React.useContext(RepoDocMetaManagerContext);
export const useTagsProvider = () => React.useContext(TagsProviderContext);

export const PersistenceLayerApp = (props: IProps) => {

    return (
        <RepoDocMetaManagerContext.Provider value={props.repoDocMetaManager}>
            <RepoDocMetaLoaderContext.Provider value={props.repoDocMetaLoader}>
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
                                                    const tagDescriptorsProvider = props.tagsType === 'documents' ? docTags : annotationTags;

                                                    const persistenceLayerMutator = new PersistenceLayerMutator(repoDocMetaManager,
                                                        persistenceLayerProvider,
                                                        tagsProvider);

                                                    const persistenceContext: IPersistenceContext = {
                                                        repoDocMetaLoader: props.repoDocMetaLoader,
                                                        repoDocMetaManager: props.repoDocMetaManager,
                                                        persistenceLayerProvider,
                                                        // userTagsProvider: () => userTags,
                                                        // docTagsProvider: docTags,
                                                        // annotationTagsProvider: annotationTags,
                                                        tagsProvider,
                                                        persistenceLayerMutator
                                                    }

                                                    const persistenceLayerContext: IPersistenceLayerContext = {
                                                        persistenceLayerProvider
                                                    }

                                                    const tagsContext: ITagsContext = {
                                                        // userTagsProvider: () => userTags,
                                                        // docTagsProvider: docTags,
                                                        // annotationTagsProvider: annotationTags,
                                                        tagsProvider
                                                    }

                                                    const tagDescriptorsContext: ITagDescriptorsContext = {
                                                        // userTagsProvider: () => userTags,
                                                        // docTagsProvider: docTags,
                                                        // annotationTagsProvider: annotationTags,
                                                        tagDescriptorsProvider
                                                    }

                                                    const docRepoRenderProps: DocRepoRenderProps = {
                                                        persistenceLayerProvider,
                                                        docTags,
                                                        annotationTags,
                                                        userTags: () => userTags || []
                                                    }

                                                    class DefaultDocMetaLookupContext extends BaseDocMetaLookupContext {

                                                        public lookup(id: IDStr) {
                                                            return repoDocMetaManager.repoDocInfoIndex.get(id)?.docMeta;
                                                        }

                                                    }

                                                    const docMetaLookupContext = new DefaultDocMetaLookupContext();

                                                    return (
                                                        <PersistenceContext.Provider value={persistenceContext}>
                                                            <PersistenceLayerContext.Provider value={persistenceLayerContext}>
                                                                <TagsContext.Provider value={tagsContext}>
                                                                    <TagDescriptorsContext.Provider value={tagDescriptorsContext}>
                                                                        <TagsProviderContext.Provider value={tagsProvider}>
                                                                            <DocMetaLookupContext.Provider value={docMetaLookupContext}>
                                                                                {props.render(docRepoRenderProps)}
                                                                            </DocMetaLookupContext.Provider>
                                                                        </TagsProviderContext.Provider>
                                                                    </TagDescriptorsContext.Provider>
                                                                </TagsContext.Provider>
                                                            </PersistenceLayerContext.Provider>
                                                        </PersistenceContext.Provider>
                                                    );

                                                }}/>

                                        }/>

                    }/>
            </RepoDocMetaLoaderContext.Provider>
        </RepoDocMetaManagerContext.Provider>
    );

}
