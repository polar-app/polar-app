import * as React from 'react';
import {createMockSnapshotSubscriber} from "../../repository/js/persistence_layer/MockSnapshots";
import {createCachedSnapshotSubscriberContext} from "../../../web/js/snapshots/CachedSnapshotSubscriberContext";
import {useDialogManager} from "../../../web/js/mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

const [CacheStoryProvider, useCachedSnapshot] = createCachedSnapshotSubscriberContext()

const Inner = () => {

    const snapshot = useCachedSnapshot();

    return (
        <div>
            source: {snapshot.source} <br/>
            exists: {snapshot.exists ? 'true' : 'false'} <br/>
            value: {snapshot.value} <br/>
        </div>
    )

}

export const CachedSnapshotStory = () => {

    const snapshotSubscriber = createMockSnapshotSubscriber();
    const dialogs = useDialogManager();

    const onError = () => {
        dialogs.confirm({
            type: 'error',
            title: 'something bad',
            subtitle: 'some bad stuff',
            onAccept: NULL_FUNCTION
        })
    }

    return (
        <CacheStoryProvider id='story'
                            snapshotSubscriber={snapshotSubscriber}
                            onError={onError}>
            <Inner/>
        </CacheStoryProvider>
    )

}