import React from 'react';
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {DataLoader} from "../../../../web/js/ui/data_loader/DataLoader";
import {RepoDocMetaLoaders} from "../RepoDocMetaLoaders";
import {AppTags} from "./AppTags";
import {
    OnErrorCallback,
    SnapshotSubscriber
} from 'polar-shared/src/util/Snapshots';
import {TagDescriptors} from "polar-shared/src/tags/TagDescriptors";
import {DataLoader2, IDataProps} from "../../../../web/js/ui/data_loader/DataLoader2";

export type TagView = 'docs' | 'annotations';

export interface IProps {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;
    readonly Component: React.FunctionComponent<IDataProps<AppTags>>;
}

export const RepoDataLoader = React.memo(function RepoDataLoader(props: IProps) {

    const {Component} = props;

    const subscriber = React.useMemo(() => RepoDocMetaManagerSnapshots.create(props.repoDocMetaLoader, props.repoDocMetaManager),
                                     [props.repoDocMetaLoader, props.repoDocMetaManager]);

    return (
        <DataLoader2 id="repoDocMetaLoader" provider={subscriber} Component={Component}/>
    );

});

function createSnapshot(repoDocMetaManager: RepoDocMetaManager): AppTags {

    const docTags = () => TagDescriptors.filterWithMembers(repoDocMetaManager.repoDocInfoIndex.toTagDescriptors());

    const annotationTags = () => TagDescriptors.filterWithMembers(repoDocMetaManager.repoDocAnnotationIndex.toTagDescriptors());

    return {
        docTags, annotationTags
    };

}

class RepoDocMetaLoaderSnapshots {

    public static create(repoDocMetaLoader: RepoDocMetaLoader): SnapshotSubscriber<boolean> {

        return (onNext: (value: boolean) => void, onError?: OnErrorCallback) => {

            // TODO use the debouncer API here...
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

        return (onNext: (value: AppTags) => void, onError?: OnErrorCallback) => {

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






