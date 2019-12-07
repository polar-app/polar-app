import React from 'react';
import {PersistenceLayerWatcher} from "./PersistenceLayerWatcher";
import {UserTagsDataLoader} from "../UserTagsDataLoader";
import {PersistenceLayerManager} from "../../../../web/js/datastore/PersistenceLayerManager";
import {ListenablePersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {Tag} from "polar-shared/src/tags/Tags";
import {TagDescriptor, TagDescriptors} from "polar-shared/src/tags/TagDescriptors";
import {RepoDataLoader} from "./RepoDataLoader";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {RepoDocMetaManager} from "../RepoDocMetaManager";

export class PersistenceLayerApp extends React.PureComponent<IProps, IState> {

    constructor(props: any) {
        super(props);


    }

    public render() {

        return (
            <PersistenceLayerWatcher persistenceLayerManager={this.props.persistenceLayerManager}
                                     render={persistenceLayerProvider =>

                 <RepoDataLoader repoDocMetaLoader={this.props.repoDocMetaLoader}
                                 repoDocMetaManager={this.props.repoDocMetaManager}
                                 render={docTags =>
                     <UserTagsDataLoader persistenceLayerProvider={persistenceLayerProvider} render={userTags => {

                         const tags = TagDescriptors.merge(docTags || [], userTags);

                         return this.props.render({
                             persistenceLayerProvider,
                             tags,
                             docTags: docTags || [],
                             userTags: userTags || []
                         });

                     }}/>

                 }/>

             }/>
        );

    }

}

export interface IProps {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly persistenceLayerManager: PersistenceLayerManager;
    readonly render: (props: DocRepoAppProps) => React.ReactElement;
}

export interface IState {

}

/**
 * Main props for any app that's using the full state of our app
 */
export interface DocRepoAppProps {
    readonly persistenceLayerProvider: ListenablePersistenceLayerProvider;
    readonly tags: ReadonlyArray<TagDescriptor>;
    readonly docTags: ReadonlyArray<TagDescriptor>;
    readonly userTags: ReadonlyArray<Tag>;
}
