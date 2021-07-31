import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {createMockSnapshot, IGenericCollectionSnapshot} from "./IGenericCollectionSnapshot";
import {useGenericFirestoreSnapshots} from "./GenericFirestoreSnapshots";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {BlockCollection} from "polar-firebase/src/firebase/om/BlockCollection";

const IS_NODE = typeof window === 'undefined';

export type IBlockCollectionSnapshot = IGenericCollectionSnapshot<IBlock>;

/**
 * This is just a hook that will be re-called from within the UI...
 */
export type BlockCollectionSnapshotsHook = () => IBlockCollectionSnapshot;

export function useFirestoreBlocksPersistenceSnapshots(listener: (snapshot: IBlockCollectionSnapshot) => void) {

    const {user} = useFirestore();

    // FIXME: we need to also include the namespaces from BlockPersistenceUser

    return useGenericFirestoreSnapshots(BlockCollection.COLLECTION, ['nspace', 'in', [user?.uid]], listener);

}

export function useBlockCollectionSnapshots(listener: (snapshot: IBlockCollectionSnapshot) => void) {

    if (IS_NODE) {
        listener(createMockSnapshot(MockBlocks.create()));
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFirestoreBlocksPersistenceSnapshots(listener);

}
