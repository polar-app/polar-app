import React from 'react';
import {ErrorHandlerCallback} from "../../../../web/js/firebase/Firebase";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {DataLoaderChildComponent} from "../../../../web/js/ui/data_loader/DataLoader2";
import {RepoDocMetaLoaders} from "../RepoDocMetaLoaders";
import {AppTags} from "./AppTags";
import {SnapshotSubscriber} from "../../../../web/js/firebase/SnapshotSubscribers";
import {TagDescriptors} from "polar-shared/src/tags/TagDescriptors";
import {DataLoader2} from "../../../../web/js/ui/data_loader/DataLoader2";

export class RepoDataLoader2 extends React.Component<IProps, IState> {

    private subscriber: SnapshotSubscriber<AppTags>;

    constructor(props: any) {
        super(props);

        this.subscriber = RepoDocMetaManagerSnapshots.create(this.props.repoDocMetaLoader,
                                                             this.props.repoDocMetaManager);

    }

    public render() {
        return (
            <DataLoader2 id="repoDocMetaLoader"
                         provider={this.subscriber}>
                {this.props.children}
            </DataLoader2>
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
    readonly children: DataLoaderChildComponent<AppTags>;

}

export interface IState {

}

class RepoDocMetaLoaderSnapshots {

    public static create(repoDocMetaLoader: RepoDocMetaLoader): SnapshotSubscriber<boolean> {

        return (onNext: (value: boolean) => void, onError: ErrorHandlerCallback) => {

            // FIXME use the debouncer API here...
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






