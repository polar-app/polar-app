import React from 'react';
import {ErrorHandlerCallback} from "../../../../web/js/firebase/Firebase";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {DataLoader} from "../../../../web/js/ui/data_loader/DataLoader";
import {RepoDocMetaLoaders} from "../RepoDocMetaLoaders";
import {AppTags} from "./AppTags";
import {SnapshotSubscriber} from "../../../../web/js/firebase/SnapshotSubscribers";
import {TagDescriptors} from "polar-shared/src/tags/TagDescriptors";

export class RepoDataLoader extends React.Component<IProps, IState> {

    private subscriber: SnapshotSubscriber<AppTags>;

    constructor(props: any) {
        super(props);

        this.subscriber = RepoDocMetaManagerSnapshots.create(this.props.repoDocMetaLoader,
                                                             this.props.repoDocMetaManager);

    }

    public render() {
        return (
            <DataLoader id="repoDocMetaLoader" provider={this.subscriber} render={value => this.props.render(value)}/>
        );

    }

}

function createSnapshot(repoDocMetaManager: RepoDocMetaManager): AppTags {

    const docTags = () => TagDescriptors.filterWithMembers(repoDocMetaManager.repoDocInfoIndex.toTagDescriptors());

    const annotationTags = () => TagDescriptors.filterWithMembers(repoDocMetaManager.repoDocAnnotationIndex.toTagDescriptors());

    return {
        docTags, annotationTags
    };

}

export type TagView = 'docs' | 'annotations';

export interface IProps {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly render: (appTags: AppTags | undefined) => React.ReactElement;
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
                         repoDocMetaManager: RepoDocMetaManager): SnapshotSubscriber<AppTags> {

        return (onNext: (value: AppTags) => void, onError: ErrorHandlerCallback) => {

            const loaderSnapshotter = RepoDocMetaLoaderSnapshots.create(repoDocMetaLoader);

            const onLoaderNext = () => {
                onNext(createSnapshot(repoDocMetaManager));
            };

            const onLoaderError = onError;

            // send the current snapshot when we first start
            onNext(createSnapshot(repoDocMetaManager));

            return loaderSnapshotter(onLoaderNext, onLoaderError);

        };

    }


}






