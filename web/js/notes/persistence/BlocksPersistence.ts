import React from 'react';
import {useFirestore} from "../../../../apps/repository/js/FirestoreProvider";
import {BlockStoreMutations} from "../store/BlockStoreMutations";
import IBlocksStoreMutation = BlockStoreMutations.IBlocksStoreMutation;
import {BlockIDStr} from "../store/BlocksStore";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export interface IBlocksPersistence {

    write(mutations: ReadonlyArray<IBlocksStoreMutation>): Promise<void>;

}

export function useBlocksPersistence() {

    const {firestore} = useFirestore();

    return React.useCallback((mutations: ReadonlyArray<IBlocksStoreMutation>) => {

        // FIXME: convert the firestore mutations to a batch...

        const collection = firestore.collection('block');
        const batch = firestore.batch();

        // FIXME: make this testable so that we convert the mutations to
        // firestore direct operations.
        for(const mutation of mutations) {

            const doc = collection.doc(mutation.id);

            switch (mutation.type) {

                case "added":
                    batch.set(doc, mutation.before);
                    break;
                case "removed":
                    batch.delete(doc)
                    break;
                case "updated":

                    // FIXME: we have to compute the operation types here and
                    // patch the datastore with updatesd. because we have to
                    // patch teh fields..

                    const mutationTargets = BlockStoreMutations.computeMutationTargets(mutation.before, mutation.after);

                    // FIXME: compute the patch changes to the items.

                    const setData: any = {
                        updated: mutation.after.updated,
                        mutation: mutation.after.mutation,
                    }

                    if (mutationTargets.includes('items')) {
                        setData.parent = mutation.after.parent;
                    }

                    if (mutationTargets.includes('parent')) {
                        setData.parent = mutation.after.parent;
                    }

                    if (mutationTargets.includes('content')) {
                        setData.content = mutation.after.content;
                        setData.links = mutation.after.links;
                    }

                    // batch.update(doc, ...setData);

                    break;

            }

        }

    }, [firestore]);

}

export namespace BlocksPersistence {

    import MutationTarget = BlockStoreMutations.MutationTarget;
    import IItemsPositionPatch = BlockStoreMutations.IItemsPositionPatch;

    export function convertToFirestoreMutations(mutations: ReadonlyArray<IBlocksStoreMutation>): ReadonlyArray<IFirestoreMutation> {

        const toFirestoreMutation = (mutation: IBlocksStoreMutation): ReadonlyArray<IFirestoreMutation> => {

            switch (mutation.type) {

                case "added":

                    return [
                        {
                            id: mutation.id,
                            type: 'set-doc',
                            value: mutation.before
                        }
                    ];

                case "removed":

                    return [
                        {
                            id: mutation.id,
                            type: 'delete-doc',
                        }
                    ];

                case "updated":

                    const createBaseMutations = (): ReadonlyArray<IFirestoreMutation> => {
                        return [
                            {
                                id: mutation.id,
                                type: 'update-path',
                                path: 'update',
                                value: mutation.after.updated
                            },
                            {
                                id: mutation.id,
                                type: 'update-path',
                                path: 'mutation',
                                value: mutation.after.mutation
                            }

                        ]
                    }

                    const convertToFirebaseMutation = (mutationTarget: MutationTarget): ReadonlyArray<IFirestoreMutation> => {

                        switch (mutationTarget) {

                            case "items":

                                const patchToFirestoreMutation = (patch: IItemsPositionPatch): IFirestoreMutation => {

                                    switch (patch.type) {

                                        case "remove":
                                            return {
                                                id: mutation.id,
                                                type: 'update-delete-field-value',
                                                path: `items.${patch.key}`
                                            }
                                        case "insert":
                                            return {
                                                id: mutation.id,
                                                type: 'update-path',
                                                path: `items.${patch.key}`,
                                                value: patch.id
                                            }

                                    }

                                }

                                const patches = BlockStoreMutations.computeItemPositionPatches(mutation.before.items,
                                                                                               mutation.after.items);

                                return patches.map(current => patchToFirestoreMutation(current));

                            case "content":
                                return [
                                    {
                                        id: mutation.id,
                                        type: 'update-path',
                                        path: 'content',
                                        value: mutation.after.content
                                    }
                                ];
                            case "parent":
                                return [
                                    {
                                        id: mutation.id,
                                        type: 'update-path',
                                        path: 'parent',
                                        value: mutation.after.parent
                                    }
                                ];

                        }

                    }

                    const mutationTargets = BlockStoreMutations.computeMutationTargets(mutation.before, mutation.after);

                    const firestoreMutations = arrayStream(mutationTargets.map(current => convertToFirebaseMutation(current)))
                            .flatMap(current => current)
                            .collect();

                    const baseMutations = createBaseMutations();

                    return [...baseMutations, ...firestoreMutations];

            }

        }

        return arrayStream(mutations.map(current => toFirestoreMutation(current)))
            .flatMap(current => current)
            .collect();

    }

}

export interface IFirestoreMutationSetDoc {
    readonly id: BlockIDStr;
    readonly type: 'set-doc';
    readonly value: any;
}

export interface IFirestoreMutationDeleteDoc {
    readonly id: BlockIDStr;
    readonly type: 'delete-doc';
}
export interface IFirestoreMutationUpdatePath {
    readonly id: BlockIDStr;
    readonly type: 'update-path';
    readonly path: string;
    readonly value: any;
}

// https://stackoverflow.com/questions/48145962/firestore-delete-a-field-inside-an-object
export interface IFirestoreMutationUpdateFieldValueDelete {
    readonly id: BlockIDStr;
    readonly type: 'update-delete-field-value';
    readonly path: string;
    // FieldValue.delete()
}

export type IFirestoreMutation =
    IFirestoreMutationSetDoc |
    IFirestoreMutationDeleteDoc |
    IFirestoreMutationUpdatePath |
    IFirestoreMutationUpdateFieldValueDelete;
