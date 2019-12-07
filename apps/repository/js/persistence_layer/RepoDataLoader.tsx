import React from 'react';
import {Tag} from "polar-shared/src/tags/Tags";
import {ErrorHandlerCallback, SnapshotSubscriber} from "../../../../web/js/firebase/Firebase";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {DataLoader} from "../../../../web/js/ui/data_loader/DataLoader";
import {RepoDocMetaLoaders} from "../RepoDocMetaLoaders";
import {TagDescriptor} from 'polar-shared/src/tags/TagDescriptors';

export class RepoDataLoader extends React.PureComponent<IProps, IState> {

    private subscriber: SnapshotSubscriber<DocTags>;

    constructor(props: any) {
        super(props);

        this.subscriber = RepoDocMetaManagerSnapshots.create(this.props.repoDocMetaLoader,
                                                             this.props.repoDocMetaManager);

    }

    public render() {

        return (
            <DataLoader id="repoDocMetaLoader" provider={this.subscriber} render={docTags => this.props.render(docTags)}/>
        );

    }

}

export interface IProps {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly render: (docTags: ReadonlyArray<TagDescriptor> | undefined) => React.ReactElement;
}

export interface IState {

}

class RepoDocMetaLoaderSnapshots {

    public static create(repoDocMetaLoader: RepoDocMetaLoader): SnapshotSubscriber<boolean> {

        return (onNext: (value: boolean) => void, onError: ErrorHandlerCallback) => {

            // const releaser = repoDocMetaLoader.addEventListener(onNext);
            const releaser = RepoDocMetaLoaders.addThrottlingEventListener(repoDocMetaLoader, () => onNext(true));

            return () => {
                releaser.release();
            };

        };

    }

}

class RepoDocMetaManagerSnapshots {

    public static create(repoDocMetaLoader: RepoDocMetaLoader,
                         repoDocMetaManager: RepoDocMetaManager): SnapshotSubscriber<DocTags> {

        return (onNext: (value: DocTags) => void, onError: ErrorHandlerCallback) => {

            const loaderSnapshotter = RepoDocMetaLoaderSnapshots.create(repoDocMetaLoader);

            const onLoaderNext = () => {
                const docTags = repoDocMetaManager.repoDocInfoIndex.toTagDescriptors();
                onNext(docTags);
            };

            const onLoaderError = onError;

            return loaderSnapshotter(onLoaderNext, onLoaderError);

        };

    }


}

export type DocTags = ReadonlyArray<TagDescriptor>;





