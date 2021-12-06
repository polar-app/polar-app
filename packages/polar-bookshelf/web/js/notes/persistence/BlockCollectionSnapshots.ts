import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {createMockSnapshot, IGenericCollectionSnapshot} from "./IGenericCollectionSnapshot";
import {useGenericFirestoreSnapshots} from "./GenericFirestoreSnapshots";
import {IBlock, NamespaceIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockCollection} from "polar-firebase/src/firebase/om/BlockCollection";
import {BlockPermissionUserCollection} from "polar-firebase/src/firebase/om/BlockPermissionUserCollection";
import React from 'react';
import {IBlockPermissionUser} from "polar-firebase/src/firebase/om/IBlockPermissionUser";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Testing} from "polar-shared/src/util/Testing";

const IS_NODE = typeof window === 'undefined';

export type IBlockCollectionSnapshot = IGenericCollectionSnapshot<IBlock>;

/**
 * This is just a hook that will be re-called from within the UI...
 */
export type BlockCollectionSnapshotsHook = () => IBlockCollectionSnapshot;

export function useFirestoreBlockCollectionSnapshots(listener: (snapshot: IBlockCollectionSnapshot) => void) {

    const firestore = useFirestore();
    const user = firestore?.user;
    const [sharedNamespaces, setSharedNamespaces] = React.useState<ReadonlyArray<NamespaceIDStr>>([]);
    const defaultUserNamespace = React.useMemo(() => user?.uid, [user?.uid]);
    const nspaces = React.useMemo(() => [defaultUserNamespace, ...sharedNamespaces], [defaultUserNamespace, sharedNamespaces]);

    // We need to also include the namespaces from BlockPersistenceUser then we
    // need to add them here to the list of namespaces we are reading from.

    useGenericFirestoreSnapshots(BlockPermissionUserCollection.COLLECTION,
                                 ['uid', '==', user?.uid],
                                 (snapshot: IGenericCollectionSnapshot<IBlockPermissionUser>) => {

        if (snapshot.empty || snapshot.docs.length !== 1) {
            // nothing to do here.
            return;
        }

        const doc = snapshot.docs[0];

        const sharedNamespaces =
            arrayStream([...doc.nspaces_ro, ...doc.nspaces_rw])
                .unique(key => key)
                .collect();

        setSharedNamespaces(sharedNamespaces);

    });

    return useGenericFirestoreSnapshots(BlockCollection.COLLECTION, ['nspace', 'in', nspaces], listener);

}

export function useBlockCollectionSnapshots(listener: (snapshot: IBlockCollectionSnapshot) => void) {

    if (IS_NODE || Testing.isTestingRuntime()) {
        listener(createMockSnapshot(MockBlocks.create()));
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFirestoreBlockCollectionSnapshots(listener);

}
