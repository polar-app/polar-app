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

interface IPersistenceLayer {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly userTagsProvider: () => ReadonlyArray<Tag> | undefined;
    readonly docTags: () => ReadonlyArray<TagDescriptor> | undefined;
    readonly annotationTags: () => ReadonlyArray<TagDescriptor> | undefined;

}

const PersistenceLayerContext = React.createContext<IPersistenceLayer | undefined>(undefined);


export interface IProps {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerManager: PersistenceLayerManager;
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

export const PersistenceLayerApp = (props: IProps) => {

    return (
        <PersistenceLayerWatcher
            persistenceLayerManager={props.persistenceLayerManager}
            render={persistenceLayerProvider =>

                <RepoDataLoader repoDocMetaLoader={props.repoDocMetaLoader}
                                repoDocMetaManager={props.repoDocMetaManager}
                                render={(appTags) =>
                                    <UserTagsDataLoader
                                        persistenceLayerProvider={persistenceLayerProvider}
                                        render={userTags => {

                                            const docTags = () => TagDescriptors.merge(appTags?.docTags(), userTags);
                                            const annotationTags = () => TagDescriptors.merge(appTags?.annotationTags(), userTags);

                                            return props.render({
                                                persistenceLayerProvider,
                                                docTags,
                                                annotationTags,
                                                userTags: () => userTags || []
                                            });

                                        }}/>

                                }/>

            }/>
    );

}
