import * as React from 'react';
import {createMockSnapshotSubscriber} from "../../repository/js/persistence_layer/MockSnapshots";
import {createCachedSnapshotSubscriber} from "../../repository/js/persistence_layer/CachedSnapshot";


const [CacheStoryProvider, useCachedSnapshot] = createCachedSnapshotSubscriber()

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

    return (
        <CacheStoryProvider id='story' snapshotSubscriber={snapshotSubscriber}>
            <Inner/>
        </CacheStoryProvider>
    )

}