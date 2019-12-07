import React from 'react';
import {PersistenceLayerWatcher} from "./PersistenceLayerWatcher";
import {UserTagsDataLoader} from "../UserTagsDataLoader";
import {PersistenceLayerManager} from "../../../../web/js/datastore/PersistenceLayerManager";
import {ListenablePersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {Tag} from "polar-shared/src/tags/Tags";
import {TagDescriptor, TagDescriptors} from "polar-shared/src/tags/TagDescriptors";
import {RepoDataLoader, TagView} from "./RepoDataLoader";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {RepoDocMetaManager} from "../RepoDocMetaManager";

export class PersistenceLayerApp extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);
    }

    public render() {

        return (
            <PersistenceLayerWatcher persistenceLayerManager={this.props.persistenceLayerManager}
                                     render={persistenceLayerProvider =>

                 <RepoDataLoader repoDocMetaLoader={this.props.repoDocMetaLoader}
                                 repoDocMetaManager={this.props.repoDocMetaManager}
                                 render={(appTags) =>
                     <UserTagsDataLoader persistenceLayerProvider={persistenceLayerProvider} render={userTags => {

                         const docTags = TagDescriptors.merge(appTags?.docTags, userTags);
                         const annotationTags = TagDescriptors.merge(appTags?.annotationTags, userTags);

                         return this.props.render({
                             persistenceLayerProvider,
                             docTags,
                             annotationTags,
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
    readonly docTags: ReadonlyArray<TagDescriptor>;
    readonly annotationTags: ReadonlyArray<TagDescriptor>;
    readonly userTags: ReadonlyArray<Tag>;
}
