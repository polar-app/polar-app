import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import React from "react";
import {IBlock} from "../store/IBlock";
import {IQuerySnapshot} from "polar-snapshot-cache/src/store/IQuerySnapshot";
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {IDocumentChange} from "polar-snapshot-cache/src/store/IDocumentChange";

const IS_NODE = typeof window === 'undefined';

export type  DocumentChangeType = 'added' |  'modified' | 'removed';

/**
 * Provides a Firebase-like snapshot API bug uses generics and actual coverted objects.
 */
export interface IGenericDocumentChange<T> {
    readonly id: string;
    readonly type: DocumentChangeType;
    readonly data: T;
}

export interface IGenericSnapshotMetadata {
    readonly hasPendingWrites: boolean;
    readonly fromCache: boolean;
}

export interface IGenericSnapshot<T> {
    readonly empty: boolean;
    readonly metadata: IGenericSnapshotMetadata;
    readonly docChanges: ReadonlyArray<IGenericDocumentChange<T>>;
}

export type IBlocksPersistenceSnapshot = IGenericSnapshot<IBlock>;

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

    const convertBlockToDocChange = (block: IBlock): IGenericDocumentChange<IBlock> => {

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

export function useFirestoreBlocksPersistenceSnapshots(listener: (snapshot: IBlocksPersistenceSnapshot) => void) {

    const {user, firestore} = useFirestore();

    React.useEffect(() => {

        if (! user) {
            return;
        }

        const convertSnapshot = (current: IQuerySnapshot): IBlocksPersistenceSnapshot => {

            // FIXME: this is actually a Firestore block and I have to convert
            // it or  'parent' could be null
            //
            // FirestoreBlocks
            const convertDocChange = (current: IDocumentChange): IGenericDocumentChange<IBlock> => {

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
            listener(convertSnapshot(current));
        }

        // we have to have an 'in' clause here...
        const collection = firestore.collection('block');
        const snapshotUnsubscriber = collection.where('nspace', 'in', [user.uid])
            .onSnapshot(current => convertSnapshotMutateState(current), err => {
                console.log("Received snapshot error: ", err);
            })

        return () => {
            snapshotUnsubscriber();
        }

    }, [firestore, listener, user])

}

export function useBlocksPersistenceSnapshots(listener: (snapshot: IBlocksPersistenceSnapshot) => void) {

    if (IS_NODE) {
        listener(createMockBlocksPersistenceSnapshot(MockBlocks.create()));
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFirestoreBlocksPersistenceSnapshots(listener);

}
