import React from 'react';
import {PersistenceLayerWatcher} from "./PersistenceLayerWatcher";
import {UserTagsDataLoader, useUserTagsDB} from "./UserTagsDataLoader";
import {PersistenceLayerManager} from "../../../../web/js/datastore/PersistenceLayerManager";
import {
    ListenablePersistenceLayerProvider,
} from "../../../../web/js/datastore/PersistenceLayer";
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
import {Provider} from "polar-shared/src/util/Providers";
import {
    BaseDocMetaLookupContext,
    DocMetaLookupContext
} from "../../../../web/js/annotation_sidebar/DocMetaLookupContextProvider";
import {IDStr} from "polar-shared/src/util/Strings";
import {AppTags} from "./AppTags";

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
    readonly persistenceLayerManager: PersistenceLayerManager;
}

export const PersistenceLayerContext = createContextMemo<IPersistenceLayerContext>(null!);
export const PersistenceContext = createContextMemo<IPersistenceContext>(null!);
export const TagsContext = createContextMemo<ITagsContext>(null!);
export const TagDescriptorsContext = createContextMemo<ITagDescriptorsContext>(null!);

TagDescriptorsContext.displayName='TagDescriptorsContext';

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

export const RepoDocMetaLoaderContext = React.createContext<RepoDocMetaLoader>(null!);
export const RepoDocMetaManagerContext = React.createContext<RepoDocMetaManager>(null!);
const TagsProviderContext = React.createContext<Provider<ReadonlyArray<Tag>>>(() =>[]);

export const useRepoDocMetaLoader = () => React.useContext(RepoDocMetaLoaderContext);
export const useRepoDocMetaManager = () => React.useContext(RepoDocMetaManagerContext);
export const useTagsProvider = () => React.useContext(TagsProviderContext);

interface IUserTagsDataLoaderDataProps {
    readonly appTags: AppTags | undefined;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly tagsType: TagsType;
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly children: JSX.Element;
}

const UserTagsDataLoaderData = React.memo(function UserTagsDataLoaderData(props: IUserTagsDataLoaderDataProps) {

    const {repoDocMetaManager, appTags, persistenceLayerProvider} = props;
    const userTagsDB = useUserTagsDB();

    const docTags = () => TagDescriptors.merge(appTags?.docTags(), userTagsDB.tags());
    const annotationTags = () => TagDescriptors.merge(appTags?.annotationTags(), userTagsDB.tags());

    const tagsProvider = props.tagsType === 'documents' ? docTags : annotationTags;
    const tagDescriptorsProvider = props.tagsType === 'documents' ? docTags : annotationTags;

    const persistenceContext: IPersistenceContext = {
        repoDocMetaLoader: props.repoDocMetaLoader,
        repoDocMetaManager: props.repoDocMetaManager,
        persistenceLayerProvider,
        // userTagsProvider: () => userTags,
        // docTagsProvider: docTags,
        // annotationTagsProvider: annotationTags,
        tagsProvider,
        persistenceLayerManager: props.persistenceLayerManager
    };

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
                            {props.children}
                        </DocMetaLookupContext.Provider>
                        </TagsProviderContext.Provider>
                    </TagDescriptorsContext.Provider>
                </TagsContext.Provider>
            </PersistenceLayerContext.Provider>
        </PersistenceContext.Provider>
    );

});

interface IRepoDataLoaderDataProps {
    readonly appTags: AppTags | undefined;
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly tagsType: TagsType;
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly children: JSX.Element;
}

const RepoDataLoaderData = React.memo(function RepoDataLoaderData(props: IRepoDataLoaderDataProps) {

    return (
        <UserTagsDataLoaderData {...props}>
            {props.children}
        </UserTagsDataLoaderData>
    );

});

interface IPersistenceLayerAppDataProps {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerManager: PersistenceLayerManager;

    /**
     * The type of tagsProvider to build based on whether we're working with
     * documents or annotations.
     */
    readonly tagsType: TagsType;

    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;

    readonly children: JSX.Element;

}

const PersistenceLayerAppData = React.memo(function PersistenceLayerAppData(props: IPersistenceLayerAppDataProps) {

    const Component = (dataProps: {data: AppTags | undefined}) => (
        <RepoDataLoaderData {...props} appTags={dataProps.data}>
            {props.children}
        </RepoDataLoaderData>
    );

    return (
        <RepoDataLoader repoDocMetaLoader={props.repoDocMetaLoader}
                        repoDocMetaManager={props.repoDocMetaManager}
                        Component={Component}/>
    )

});

export interface IProps {

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly persistenceLayerManager: PersistenceLayerManager;

    /**
     * The type of tagsProvider to build based on whether we're working with
     * documents or annotations.
     */
    readonly tagsType: TagsType;

    readonly children: JSX.Element;
}

export const PersistenceLayerApp = React.memo(function PersistenceLayerApp(props: IProps) {

    const Component = (dataProps: {persistenceLayerProvider: ListenablePersistenceLayerProvider}) => (
        <PersistenceLayerAppData {...props} persistenceLayerProvider={dataProps.persistenceLayerProvider}>
            {props.children}
        </PersistenceLayerAppData>
    );

    return (
        <RepoDocMetaManagerContext.Provider value={props.repoDocMetaManager}>
            <RepoDocMetaLoaderContext.Provider value={props.repoDocMetaLoader}>
                <PersistenceLayerWatcher persistenceLayerManager={props.persistenceLayerManager}
                                         Component={Component}/>
            </RepoDocMetaLoaderContext.Provider>
        </RepoDocMetaManagerContext.Provider>
    );

});

PersistenceLayerApp.displayName='PersistenceLayerApp';
