import React from 'react';
import {BlocksPersistenceWriter} from "./FirestoreBlocksStoreMutations";
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {useBlocksStoreContext} from '../store/BlockStoreContextProvider';
import {useRepoDocMetaManager} from '../../../../apps/repository/js/persistence_layer/PersistenceLayerApp';
import {Testing} from "polar-shared/src/util/Testing";
import {FirestoreBlocksPersistenceWriter} from "./FirestoreBlocksPersistenceWriter";
import {IBlocksStoreMutation} from '../store/IBlocksStoreMutation';
import {useErrorHandler} from "../../mui/MUIErrorHandler";

const IS_NODE = typeof window === 'undefined';

interface IBuffer<T> {

    /**
     * Push records to the end of the buffer.
     */
    readonly push: (data: ReadonlyArray<T>) => void;

    /**
     * True when we need to flush the buffer.
     */
    readonly flushable: () => boolean;

    readonly peek: () => ReadonlyArray<T>;

    /**
     * Create a snapshot of the underlying data and reset the internal buffer.
     */
    readonly snapshotAndReset: () => ReadonlyArray<T>;
}

function useBuffer<T>(capacity: number): IBuffer<T> {

    const buff = React.useMemo<T[]>(() =>[], []);

    const push = React.useCallback((data: ReadonlyArray<T>) => {
        buff.push(...data);
    }, [buff])

    const flushable = React.useCallback(() => {
        return buff.length >= capacity;
    }, [buff, capacity]);

    const snapshotAndReset = React.useCallback(() => {
        return buff.splice(0, buff.length);
    }, [buff])

    const peek = React.useCallback(() => {
        return [...buff];
    }, [buff]);

    return React.useMemo(() => {
        return {
            push, flushable, snapshotAndReset, peek
        }
    }, [flushable, push, snapshotAndReset, peek])

}

/**
 * Fancy debouncer which also executes on unmount.
 *
 * Note that the debouncer must be idempotent.
 */
export function useDebouncer(callback: () => void, interval: number = 500) {

    // eslint-disable-next-line @typescript-eslint/ban-types
    const timeout = React.useRef<number | undefined>(undefined);

    React.useEffect(() => {

        return () => {

            if (timeout.current) {
                // we are about to unmount, so we can't run the timeout because
                // if we do it will work with data that's no longer available
                // because React has unmounted.
                window.clearTimeout(timeout.current);
            }

            // the debouncer must be called when we unmount.
            callback();
        }

    }, [callback])


    return React.useCallback(() => {

        if (timeout.current) {
            // already scheduled
            return;
        }

        timeout.current = window.setTimeout(() => {

            callback();
            // now clear the timeout so we can schedule again
            timeout.current = undefined;

        }, interval);

    }, [callback, interval]);

}

export function useFirestoreBlocksPersistenceWriter(): BlocksPersistenceWriter {

    const {firestore} = useFirestore();
    const {uid} = useBlocksStoreContext();
    const repoDocMetaManager = useRepoDocMetaManager();
    const errorHandler = useErrorHandler();

    const mutationBuffer = useBuffer<IBlocksStoreMutation>(50);

    const doCommit = React.useCallback(() => {

        const snapshot = mutationBuffer.snapshotAndReset()

        if (snapshot.length === 0) {
            // there's nothing to commit.  This can happen if we've manually
            // flushed
            return;
        }

        // IMPORTANT NOTE: with this mechanism, we might write to a block N
        // times but the operations are ordered so the last writer wins, so, I
        // think this should be safe.

        console.log("Going to commit N snapshot mutations: " + snapshot.length);

        // TODO use a dialog handler for this for when we get an error.
        FirestoreBlocksPersistenceWriter.doExec(
            uid,
            firestore,
            repoDocMetaManager.repoDocInfoIndex,
            snapshot
        ).catch(err => errorHandler("Unable to commit mutations: ", err, snapshot));

    }, [errorHandler, firestore, mutationBuffer, repoDocMetaManager.repoDocInfoIndex, uid])

    const debouncer = useDebouncer(doCommit, 5000);

    /**
     * Return true if a flush is required.
     */
    const flushRequired = React.useCallback(() => {

        const snapshot = mutationBuffer.peek();

        // Go through all mutations and if ANY mutation is for a document we
        // require a flush. initially I was thinking that we would only do this
        // if there was just one mutation and it was a document which normally
        // would work fine, however, if the user types a bunch of text in the
        // sidebar, then they click, flag on the document, we would want to
        // flush everything immediately.
        //
        // Additionally, we flush immediately if more than one block ID is
        // involved in the mutations.  This would happen during splits
        // and other mutations.

        const docIDs: {[key: string]: boolean} = {};

        for(const mutation of snapshot) {

            function computeBlock() {
                switch (mutation.type) {
                    case "added":
                        return mutation.added;
                    case "removed":
                        return mutation.removed;
                    case "modified":
                        return mutation.after;

                }
            }

            const block = computeBlock();

            if (block.content.type === 'document') {
                return true;
            }

            docIDs[block.id] = true;

        }

        return Object.keys(docIDs).length > 1;

    }, [mutationBuffer])

    return React.useCallback((mutations: ReadonlyArray<IBlocksStoreMutation>) => {

        mutationBuffer.push(mutations);

        // the debouncer needs to be run on every single commit to schedule
        // commits in the future so that if we have less data than the
        // mutationBuffer it will get flushed eventually.
        debouncer();

        // we have to flush if we've exceeded capacity.
        if (mutationBuffer.flushable()) {
            doCommit();
        }

        if (flushRequired()) {
            doCommit();
        }

    }, [debouncer, doCommit, mutationBuffer, flushRequired]);

}

function createMockBlocksPersistenceWriter(): BlocksPersistenceWriter {

    return async (_: ReadonlyArray<IBlocksStoreMutation>) => {
        // noop
    }

}

export function useBlocksPersistenceWriter(): BlocksPersistenceWriter {

    if (IS_NODE || Testing.isTestingRuntime()) {
        return createMockBlocksPersistenceWriter();
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFirestoreBlocksPersistenceWriter();

}
