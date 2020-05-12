import React, {useContext} from "react";
import {
    Callback,
    Functions,
    NULL_FUNCTION,
    Callback1
} from "polar-shared/src/util/Functions";
import {IDocAnnotation} from "./DocAnnotation";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FlashcardInputFieldsType} from "./child_annotations/flashcards/flashcard_input/FlashcardInputs";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {FlashcardActions} from "./child_annotations/flashcards/FlashcardActions";
import {CommentActions} from "./child_annotations/comments/CommentActions";
import {IComment} from "polar-shared/src/metadata/IComment";
import {HTMLStr} from "polar-shared/src/util/Strings";
import {TextHighlights} from "../metadata/TextHighlights";
import {AnnotationMutations} from "polar-shared/src/metadata/mutations/AnnotationMutations";
import {IRef} from "polar-shared/src/metadata/Refs";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {DialogManager} from "../../spectron0/material-ui/dialogs/MUIDialogController";
import {
    IPersistence,
    ITags
} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {RepoDocMetaLoader} from "../../../apps/repository/js/RepoDocMetaLoader";
import {RepoDocMetaManager} from "../../../apps/repository/js/RepoDocMetaManager";
import {SynchronizingDocLoader} from "../../../apps/repository/js/util/SynchronizingDocLoader";
import {RepoDocMetas} from "../../../apps/repository/js/RepoDocMetas";
import {TaggedCallbacks} from "../../../apps/repository/js/annotation_repo/TaggedCallbacks";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Logger} from "polar-shared/src/logger/Logger";
import {Tag, Tags} from "polar-shared/src/tags/Tags";

const log = Logger.create();

/**
 * This allows us to specify what's is being mutated.  If selected is specified
 * we mutate just these objects. NOT that's selected in the UI tables.
 */
export interface IAnnotationMutationSelected {
    readonly selected?: ReadonlyArray<IDocAnnotation>;
}

/**
 * The selected annotations are required with this interface
 */
export interface IAnnotationMutationSelectedRequired {
    readonly selected: ReadonlyArray<IDocAnnotation>;
}

export interface ICommentCreate {
    readonly type: 'create';
    readonly parent: IRef;
    readonly body: HTMLStr;
}

export interface ICommentUpdate {
    readonly type: 'update';
    readonly parent: IRef;
    readonly body: HTMLStr;
    readonly existing: IDocAnnotation;
}

export interface ICommentDelete {
    readonly type: 'delete';
    readonly parent: IRef;
    readonly existing: IDocAnnotation;
}

export type ICommentMutation = ICommentCreate | ICommentUpdate | ICommentDelete;

export interface IFlashcardCreate extends IAnnotationMutationSelected {
    readonly type: 'create';
    readonly parent: IRef;
    readonly flashcardType: FlashcardType,
    readonly fields: Readonly<FlashcardInputFieldsType>
}

export interface IFlashcardUpdate extends IAnnotationMutationSelected {
    readonly type: 'update';
    readonly parent: IRef;
    readonly flashcardType: FlashcardType,
    readonly fields: Readonly<FlashcardInputFieldsType>
}
export interface IFlashcardDelete extends IAnnotationMutationSelected {
    readonly type: 'delete';
    readonly parent: IRef;
    readonly existing: IDocAnnotation;
}

export type IFlashcardMutation = IFlashcardCreate | IFlashcardUpdate | IFlashcardDelete;

export interface ITextHighlightRevert extends IAnnotationMutationSelected {
    readonly type: 'revert';
}

export interface ITextHighlightUpdate extends IAnnotationMutationSelected {
    readonly type: 'update';
    readonly body: string;
}

export type ITextHighlightMutation = ITextHighlightRevert | ITextHighlightUpdate;

export interface IDeleteMutation extends IAnnotationMutationSelected {

}

export type IDeleteMutationWithSelectedRequired = IDeleteMutation & IAnnotationMutationSelectedRequired;

export interface IColorMutation {
    readonly color: string;
}

export interface ITaggedMutation extends IAnnotationMutationSelected {
}

export interface IAnnotationMutationCallbacks {

    /**
     * Create a specific callback as a react callback that can be used with a
     * fixed set of selected items.
     */
    readonly createDeletedCallback: (mutation: IDeleteMutationWithSelectedRequired) => Callback;
    /**
     * Delete the given items or whatever is selected.
     */
    readonly onDeleted: (mutation?: IDeleteMutation) => void;

    readonly createTaggedCallback: (mutation: IDeleteMutationWithSelectedRequired) => Callback;
    readonly onTagged: (mutation?: ITaggedMutation) => void;

    readonly onTextHighlight: (mutation: ITextHighlightMutation) => void;

    readonly createCommentCallback: (selected: IAnnotationMutationSelectedRequired) => (mutation: ICommentMutation) => void;

    readonly onComment: (mutation: ICommentMutation & IAnnotationMutationSelectedRequired) => void;
    readonly onFlashcard: (mutation: IFlashcardMutation) => void;

    readonly createColorCallback: (selected: IAnnotationMutationSelected) => (mutation: IColorMutation) => void;

    // TODO: in the future it would be nice to pick the color for multiple items
    // but we can't right now.
    readonly onColor: (mutation: IColorMutation) => void;

}

export const AnnotationMutationsContext = React.createContext<IAnnotationMutationCallbacks>({

    // FIXME I just need to inject this code into the doc viewer and we're done
    //

    createDeletedCallback: () => NULL_FUNCTION,
    onDeleted: NULL_FUNCTION,
    onTextHighlight: NULL_FUNCTION,

    createCommentCallback: () => NULL_FUNCTION,
    onComment: NULL_FUNCTION,

    onFlashcard: NULL_FUNCTION,

    createColorCallback: () => NULL_FUNCTION,
    onColor: NULL_FUNCTION,

    createTaggedCallback: () => NULL_FUNCTION,
    onTagged: NULL_FUNCTION,

});

export function useAnnotationMutationsContext() {
    return useContext(AnnotationMutationsContext);
}

export namespace DocAnnotationsMutator {

    export function onComment(docMeta: IDocMeta,
                              pageMeta: IPageMeta,
                              mutation: ICommentMutation) {

        switch (mutation.type) {

            case "create":
                CommentActions.create(docMeta,
                                      pageMeta,
                                      mutation.parent,
                                      mutation.body);
                break;

            case "update":
                CommentActions.update(docMeta,
                                      pageMeta,
                                      mutation.parent,
                                      mutation.body,
                                      mutation.existing.original as IComment);
                break;

            case "delete":
                CommentActions.delete(mutation.existing);
                break;

        }

    }

    export function onFlashcard(docMeta: IDocMeta, pageMeta: IPageMeta, mutation: IFlashcardMutation) {

        switch (mutation.type) {

            case "create":
                FlashcardActions.create(mutation.parent,
                                        pageMeta,
                                        mutation.flashcardType,
                                        mutation.fields);
                break;
            //
            case "update":

                const selected = mutation.selected || [];

                for (const flashcard of selected) {
                    FlashcardActions.update(docMeta,
                                            pageMeta,
                                            mutation.parent,
                                            mutation.flashcardType,
                                            mutation.fields,
                                            flashcard);
                }

                break;

            case "delete":
                FlashcardActions.delete(docMeta,
                                        pageMeta,
                                        mutation.parent,
                                        mutation.existing);
                break;

        }

    }

    export function onTextHighlight(docMeta: IDocMeta, pageMeta: IPageMeta, mutation: ITextHighlightMutation) {

        switch (mutation.type) {
            case "revert":

                Functions.withTimeout(() => {

                    const selected = mutation.selected || [];

                    for (const textHighlight of selected) {
                        TextHighlights.resetRevisedText(docMeta,
                                                        pageMeta,
                                                        textHighlight.id);
                    }

                });

                break;

            case "update":

                Functions.withTimeout(() => {

                    const selected = mutation.selected || [];

                    for (const textHighlight of selected) {

                        TextHighlights.setRevisedText(docMeta,
                                                      pageMeta,
                                                      textHighlight.id,
                                                      mutation.body);
                    }

                });
                break;

        }

    }

    export function onDeleted(docMeta: IDocMeta, pageMeta: IPageMeta, mutation: IDeleteMutation) {

        for (const current of mutation.selected || []) {
            AnnotationMutations.delete(docMeta, current.annotationType, current.original);
        }

    }

}
export namespace AnnotationMutationCallbacks {

    import ComputeNewTagsStrategy = Tags.ComputeNewTagsStrategy;
    import TaggedCallbacksOpts = TaggedCallbacks.TaggedCallbacksOpts;

    // FIXME IAnnotationMutationCallbacks

    export function create(refresher: () => void,
                           dialogs: DialogManager,
                           persistence: IPersistence,
                           repoDocMetaLoader: RepoDocMetaLoader,
                           repoDocMetaManager: RepoDocMetaManager,
                           tagsContext: ITags) {

        const synchronizingDocLoader
            = new SynchronizingDocLoader(persistence.persistenceLayerProvider);

        type AnnotationMutator<T extends IAnnotationMutationSelected> = (docMeta: IDocMeta,
                                                                         pageMeta: IPageMeta,
                                                                         mutation: T) => void;

        /**
         *
         * @param mutation The mutation to execute along with the annotations.
         * @param annotationMutator The mutator to mutate the annotations.
         * @param refresher called for each mutation to update the store.
         */
        async function handleUpdate<T extends IAnnotationMutationSelectedRequired>(mutation: T,
                                                                                   annotationMutator: AnnotationMutator<T>) {

            const selected = mutation.selected;
            const {persistenceLayerProvider} = persistence;

            const partitions = arrayStream(selected)
                .partition(annotation => [annotation.docMeta.docInfo.fingerprint, annotation.docMeta]);

            // *** first we have to apply all the mutations to every annotation in
            // this doc...
            for (const partition of Object.values(partitions)) {
                const docMeta = partition.key;

                for (const annotation of selected) {
                    const pageMeta = annotation.pageMeta;
                    annotationMutator(docMeta, pageMeta, {
                        ...mutation,
                        selected: [annotation]
                    });
                }
            }

            // *** now we have to update the store
            for (const partition of Object.values(partitions)) {
                const docMeta = partition.key;
                const fingerprint = docMeta.docInfo.fingerprint;
                const repoDocMeta = RepoDocMetas.convert(persistenceLayerProvider, fingerprint, docMeta);
                repoDocMetaManager.updateFromRepoDocMeta(docMeta.docInfo.fingerprint, repoDocMeta);
            }

            refresher();

            for (const partition of Object.values(partitions)) {
                const docMeta = partition.key;
                const persistenceLayer = persistenceLayerProvider();
                await persistenceLayer.writeDocMeta(docMeta);
            }

        }
//
//
        function doTagged(annotations: ReadonlyArray<IDocAnnotation>,
                          tags: ReadonlyArray<Tag>,
                          strategy: ComputeNewTagsStrategy = 'set') {

            if (tags.length === 0) {
                log.warn("No tags");
                return;
            }

            handleUpdate({selected: annotations}, (docMeta, pageMeta, mutation) => {

                for (const current of mutation.selected) {

                    const updates = {
                        tags: Tags.toMap(tags)
                    };

                    AnnotationMutations.update(docMeta,
                                               current.annotationType,
                                               {...current.original, ...updates});

                }

            }).catch(err => log.error(err));


        }

        function createTaggedCallback(mutation: IDeleteMutationWithSelectedRequired) {

            const opts: TaggedCallbacksOpts<IDocAnnotation> = {
                targets: () => mutation.selected,
                tagsProvider: tagsContext.tagsProvider,
                dialogs,
                doTagged
            }

            return TaggedCallbacks.create(opts);

        }
//
//
//         function onTagged() {
//
//             const opts: TaggedCallbacksOpts<IDocAnnotation> = {
//                 targets: selectedAnnotations,
//                 tagsProvider: tagsContext.tagsProvider,
//                 dialogs,
//                 doTagged
//             }
//
//             const callback = TaggedCallbacks.create(opts);
//
//             callback();
//
//         }
//
//         function selectedAnnotations<T extends IAnnotationMutationSelected>(opts?: T): ReadonlyArray<IDocAnnotation> {
//
//             if (opts && opts.selected) {
//                 return opts.selected;
//             }
//
//             const store = storeProvider();
//
//             const {selected, viewPage} = store;
//
//             return viewPage.filter(current => selected.includes(current.id));
//
//         }
//
        function createDeletedCallback(mutation: IDeleteMutationWithSelectedRequired): Callback {

            return React.useCallback(() => {
                onDeleted(mutation);
            }, []);

        }
        function doDeleted(annotations: ReadonlyArray<IDocAnnotation>) {

            const mutation: IDeleteMutationWithSelectedRequired = {
                selected: annotations
            }

            handleUpdate(mutation, DocAnnotationsMutator.onDeleted)
                .catch(err => log.error(err));

        }

        function onDeleted(mutation: IDeleteMutationWithSelectedRequired) {

            // FIXME: do I need to unify this action with doc repo store?

            const annotations = mutation.selected;

            if (annotations.length === 0) {
                log.warn("no repoAnnotation");
                return;
            }

            dialogs.confirm({
                title: "Are you sure you want to delete this item?",
                subtitle: "This is a permanent operation and can't be undone.",
                onAccept: () => doDeleted(annotations)
            })

        }

        function onTextHighlight(mutation: ITextHighlightMutation & IAnnotationMutationSelectedRequired) {
            handleUpdate(mutation, DocAnnotationsMutator.onTextHighlight)
            .catch(err => log.error(err));
        }

        function createCommentCallback(selected: IAnnotationMutationSelectedRequired): Callback1<ICommentMutation> {

            return React.useCallback((mutation: ICommentMutation) => {
                onComment({...selected, ...mutation});
            }, []);

        }

        function onComment(mutation: ICommentMutation & IAnnotationMutationSelectedRequired) {
            handleUpdate(mutation, DocAnnotationsMutator.onComment)
            .catch(err => log.error(err));
        }

        function onFlashcard(mutation: IFlashcardMutation & IAnnotationMutationSelectedRequired) {
            handleUpdate(mutation, DocAnnotationsMutator.onFlashcard)
            .catch(err => log.error(err));
        }
//
        function createColorCallback(selected: IAnnotationMutationSelectedRequired): Callback1<IColorMutation> {

            return React.useCallback((mutation: IColorMutation) => {
                onColor({...selected, ...mutation});
            }, []);

        }
//
        function onColor(mutation: IColorMutation & IAnnotationMutationSelectedRequired) {


            // FIXME noop

        }

        return {
            createDeletedCallback,
            onDeleted,
            onTextHighlight,
            createCommentCallback,
            onComment,
            onFlashcard,
            createColorCallback,
            onColor,
            createTaggedCallback,
            // onTagged,
        };

    }

}

