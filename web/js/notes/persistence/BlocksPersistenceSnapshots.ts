import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import React from "react";
import {IBlock} from "../store/IBlock";
import {IQuerySnapshot} from "polar-snapshot-cache/src/store/IQuerySnapshot";
import {IDocumentChange} from "polar-snapshot-cache/src/store/IDocumentChange";
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";

const IS_NODE = typeof window === 'undefined';

export type  DocumentChangeType = 'added' |  'modified' | 'removed';

export interface DocumentChange<T> {
    readonly id: string;
    readonly type: DocumentChangeType;
    readonly data: T;
}

export interface ISnapshotMetadata {
    readonly hasPendingWrites: boolean;
    readonly fromCache: boolean;
}

export interface IBlocksPersistenceSnapshot {
    readonly empty: boolean;
    readonly metadata: ISnapshotMetadata;
    readonly docChanges: ReadonlyArray<DocumentChange<IBlock>>;
}

/**
 * This is just a hook that will be re-called from within the UI...
 */
export type BlocksPersistenceSnapshotsHook = () => IBlocksPersistenceSnapshot;

function createNullBlockPersistenceSnapshots(): BlocksPersistenceSnapshotsHook {

    return () => {
        return createMockBlocksPersistenceSnapshot(MockBlocks.create());
    }

}

/**
 * Use blocks to create mock snapshots where everything is 'added'
 */
export function createMockBlocksPersistenceSnapshot(blocks: ReadonlyArray<IBlock>): IBlocksPersistenceSnapshot {

    const convertBlockToDocChange = (block: IBlock): DocumentChange<IBlock> => {

        return {
            id: block.id,
            type: 'added',
            data: block
        }
    }

    return {
        empty: blocks.length === 0,
        metadata: {
            hasPendingWrites: false,
            fromCache: true
        },
        docChanges: blocks.map(current => convertBlockToDocChange(current))
    };

}

export function createEmptyBlocksPersistenceSnapshot(): IBlocksPersistenceSnapshot {

    return {
        empty: true,
        metadata: {
            hasPendingWrites: false,
            fromCache: true
        },
        docChanges: []
    }

}

// FIXME write a function to take the snapshot and update teh store..

export function useFirestoreBlocksPersistenceSnapshots(): IBlocksPersistenceSnapshot {

    const {user, firestore} = useFirestore();
    const [snapshot, setSnapshot] = React.useState<IBlocksPersistenceSnapshot>(createEmptyBlocksPersistenceSnapshot());

    React.useEffect(() => {

        if (! user) {
            return;
        }

        const convertSnapshot = (current: IQuerySnapshot): IBlocksPersistenceSnapshot => {

            const convertDocChange = (current: IDocumentChange): DocumentChange<IBlock> => {

                const data: IBlock = current.doc.data() as IBlock;

                return {
                    id: current.id,
                    type: current.type,
                    data
                }
            }

            return {
                empty: current.empty,
                metadata: {
                    hasPendingWrites: current.metadata.hasPendingWrites,
                    fromCache: current.metadata.fromCache
                },
                docChanges: current.docChanges().map(current => convertDocChange(current))
            }

        }

        const convertSnapshotMutateState = (current: IQuerySnapshot): void => {
            setSnapshot(convertSnapshot(current));
        }

        // we have to have an 'in' clause here...
        const collection = firestore.collection('block');
        const snapshotUnsubscriber = collection.where('nspace', 'in', [user.uid])
            .onSnapshot(current => convertSnapshotMutateState(current))

        return () => {
            snapshotUnsubscriber();
        }

    }, [firestore, user])

    return snapshot;

}

export function useBlocksPersistenceSnapshots(): IBlocksPersistenceSnapshot {

    if (IS_NODE) {
        return createMockBlocksPersistenceSnapshot(MockBlocks.create());
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFirestoreBlocksPersistenceSnapshots();

}
