import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;
import {BlockIDStr, IBlockContent} from "../store/BlocksStore";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IBlock} from "../store/IBlock";

export type BlocksPersistenceWriter = (mutations: ReadonlyArray<IBlocksStoreMutation>) => void;

// export interface IFirestoreBlock<C extends IBlockContent = IBlockContent> extends Exclude<IBlock<C>, 'parent'> {
//
//     readonly parent: BlockIDStr | null;
//
// }


export namespace FirestoreBlocksStoreMutations {

    import MutationTarget = BlocksStoreMutations.MutationTarget;
    import IItemsPositionPatch = BlocksStoreMutations.IItemsPositionPatch;

    export interface IFirestoreMutationSetDoc {
        readonly id: BlockIDStr;
        readonly type: 'set-doc';
        readonly value: IBlock;
    }

    export interface IFirestoreMutationDeleteDoc {
        readonly id: BlockIDStr;
        readonly type: 'delete-doc';
    }
    export interface IFirestoreMutationUpdatePath {
        readonly id: BlockIDStr;
        readonly type: 'update-path';
        readonly path: ReadonlyArray<string>;
        readonly value: any;
    }

    export interface IFirestoreMutationUpdatePathNumber {
        readonly id: BlockIDStr;
        readonly type: 'update-path-number';
        readonly path: ReadonlyArray<string>;
        readonly value: number;
    }

    export interface IFirestoreMutationUpdatePathString {
        readonly id: BlockIDStr;
        readonly type: 'update-path-string';
        readonly path: ReadonlyArray<string>;
        readonly value: string;
    }

    export interface IFirestoreMutationUpdatePathObject {
        readonly id: BlockIDStr;
        readonly type: 'update-path-object';
        readonly path: ReadonlyArray<string>;
        readonly value: object;
    }

    export interface IFirestoreMutationUpdatePathStringArray {
        readonly id: BlockIDStr;
        readonly type: 'update-path-string-array';
        readonly path: ReadonlyArray<string>;
        readonly value: ReadonlyArray<string>;
    }

    // https://stackoverflow.com/questions/48145962/firestore-delete-a-field-inside-an-object
    export interface IFirestoreMutationUpdateFieldValueDelete {
        readonly id: BlockIDStr;
        readonly type: 'update-delete-field-value';
        readonly path: ReadonlyArray<string>;
    }

    export type IFirestoreMutation =
        IFirestoreMutationSetDoc |
        IFirestoreMutationDeleteDoc |
        IFirestoreMutationUpdatePathNumber |
        IFirestoreMutationUpdatePathString |
        IFirestoreMutationUpdatePathObject |
        IFirestoreMutationUpdatePathStringArray |
        IFirestoreMutationUpdateFieldValueDelete;

    /**
     * Convert the mutation for Firestore mutations which can then me mapped
     * directly to a Firestore Batch.
     */
    export function convertToFirestoreMutations(mutations: ReadonlyArray<IBlocksStoreMutation>): ReadonlyArray<IFirestoreMutation> {

        const toFirestoreMutation = (mutation: IBlocksStoreMutation): ReadonlyArray<IFirestoreMutation> => {

            switch (mutation.type) {

                case "added":

                    return [
                        {
                            id: mutation.id,
                            type: 'set-doc',
                            value: mutation.added
                        }
                    ];

                case "removed":

                    return [
                        {
                            id: mutation.id,
                            type: 'delete-doc',
                        }
                    ];

                case "modified":

                    const createBaseMutations = (): ReadonlyArray<IFirestoreMutation> => {
                        return [
                            {
                                id: mutation.id,
                                type: 'update-path-string',
                                path: ['updated'],
                                value: mutation.after.updated
                            },
                            {
                                id: mutation.id,
                                type: 'update-path-number',
                                path: ['mutation'],
                                value: mutation.after.mutation
                            }

                        ]
                    }

                    const convertToFirebaseMutation = (mutationTarget: MutationTarget): ReadonlyArray<IFirestoreMutation> => {

                        switch (mutationTarget) {

                            case "items":

                                const patchToFirestoreMutation = (patch: IItemsPositionPatch): IFirestoreMutation => {

                                    switch (patch.type) {

                                        // FIXME: this is the bug as the '.' is not being encoded.
                                        // FIXME: I could use FieldPath with this... that might work but that
                                        // might require snapshot cache changed :-/

                                        case "remove":
                                            return {
                                                id: mutation.id,
                                                type: 'update-delete-field-value',
                                                path: ['items', patch.key]
                                            }
                                        case "insert":
                                            return {
                                                id: mutation.id,
                                                type: 'update-path-string',
                                                path: ['items', patch.key],
                                                value: patch.id
                                            }

                                    }

                                }

                                const patches = BlocksStoreMutations.computeItemPositionPatches(mutation.before.items,
                                                                                                mutation.after.items);

                                return patches.map(current => patchToFirestoreMutation(current));

                            case "content":
                                return [
                                    {
                                        id: mutation.id,
                                        type: 'update-path-object',
                                        path: ['content'],
                                        value: mutation.after.content
                                    }
                                ];
                            case "parent":

                                if (mutation.after.parent !== undefined) {
                                    return [
                                        {
                                            id: mutation.id,
                                            type: 'update-path-string',
                                            path: ['parent'],
                                            value: mutation.after.parent
                                        }
                                    ];

                                } else {
                                    return [
                                        {
                                            id: mutation.id,
                                            type: 'update-delete-field-value',
                                            path: ['parent'],
                                        }
                                    ];
                                }


                            case "parents":
                                return [
                                    {
                                        id: mutation.id,
                                        type: 'update-path-string-array',
                                        path: ['parents'],
                                        value: mutation.after.parents
                                    }
                                ];

                        }

                    }

                    // FIXME: the INTEGER path has a 'dot' in it.. so that's fucking us!

                    const mutationTargets = BlocksStoreMutations.computeMutationTargets(mutation.before, mutation.after);

                    const firestoreMutations = arrayStream(mutationTargets.map(current => convertToFirebaseMutation(current)))
                            .flatMap(current => current)
                            .collect();

                    const baseMutations = createBaseMutations();

                    const result = [...baseMutations, ...firestoreMutations];

                    return result;

            }

        }

        // console.log("convertToFirestoreMutations: mutations: ", mutations);

        return arrayStream(mutations.map(current => toFirestoreMutation(current)))
            .flatMap(current => current)
            .collect();

    }

}
