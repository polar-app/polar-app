import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {IBlock} from "../store/IBlock";
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {createMockSnapshot, IGenericSnapshot} from "./IGenericSnapshot";
import {useGenericFirestoreSnapshots} from "./GenericFirestoreSnapshots";

const IS_NODE = typeof window === 'undefined';

export type IBlocksPersistenceSnapshot = IGenericSnapshot<IBlock>;

/**
 * This is just a hook that will be re-called from within the UI...
 */
export type BlocksPersistenceSnapshotsHook = () => IBlocksPersistenceSnapshot;

export function useFirestoreBlocksPersistenceSnapshots(listener: (snapshot: IBlocksPersistenceSnapshot) => void) {

    const {user} = useFirestore();

    return useGenericFirestoreSnapshots('block', ['nspace', 'in', [user?.uid]], listener);

}

export function useBlocksPersistenceSnapshots(listener: (snapshot: IBlocksPersistenceSnapshot) => void) {

    if (IS_NODE) {
        listener(createMockSnapshot(MockBlocks.create()));
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFirestoreBlocksPersistenceSnapshots(listener);

}
