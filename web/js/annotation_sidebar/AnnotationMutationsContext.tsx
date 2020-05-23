import React, {useContext} from "react";
import {
    ASYNC_NULL_FUNCTION,
    Callback,
    Callback1,
    Functions,
    NULL_FUNCTION
} from "polar-shared/src/util/Functions";
import {IDocAnnotation, IDocAnnotationRef} from "./DocAnnotation";
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
import {
    usePersistenceLayerContext,
    useTagsContext
} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {TaggedCallbacks} from "../../../apps/repository/js/annotation_repo/TaggedCallbacks";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Logger} from "polar-shared/src/logger/Logger";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {
    AreaHighlights,
    AreaHighlightWriteOpts
} from "../metadata/AreaHighlights";
import {ICapturedScreenshot} from "../screenshots/Screenshot";
import {AreaHighlightRect} from "../metadata/AreaHighlightRect";
import {Position} from "polar-shared/src/metadata/IBaseHighlight";
import ComputeNewTagsStrategy = Tags.ComputeNewTagsStrategy;
import {AreaHighlightRects} from "../metadata/AreaHighlightRects";
import {Arrays} from "polar-shared/src/util/Arrays";
import {useDocMetaContext} from "./DocMetaContextProvider";
import {useDocMetaLookupContext} from "./DocMetaLookupContextProvider";
import {DocMetas} from "polar-shared/src/metadata/DocMetas";

const log = Logger.create();

/**
 * This allows us to specify what's is being mutated.
 */
export interface IAnnotationMutationSelected {
    readonly selected: ReadonlyArray<IDocAnnotationRef>;
}

export interface ICommentCreate extends IAnnotationMutationSelected {
    readonly type: 'create';
    readonly parent: IRef;
    readonly body: HTMLStr;
}

export interface ICommentUpdate extends IAnnotationMutationSelected {
    readonly type: 'update';
    readonly parent: IRef;
    readonly body: HTMLStr;
    readonly existing: IDocAnnotationRef;
}

export interface ICommentDelete extends IAnnotationMutationSelected {
    readonly type: 'delete';
    readonly parent: IRef;
    readonly existing: IDocAnnotationRef;
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

interface IAreaHighlightBaseMutation {
    readonly areaHighlight: IAreaHighlight;
    readonly capturedScreenshot: ICapturedScreenshot;
    readonly position: Position;
    readonly docMeta: IDocMeta;
    readonly pageMeta: IPageMeta;
}

export interface IAreaHighlightCreate extends IAreaHighlightBaseMutation {
    readonly type: 'create';
}

export interface IAreaHighlightUpdate extends IAreaHighlightBaseMutation {
    readonly type: 'update';
}

export type IAreaHighlightMutation = IAreaHighlightCreate | IAreaHighlightUpdate;

export interface ITextHighlightCreate {
    readonly type: 'create';

    // we have to specify the textHighlight, the docMeta, and the PageMeta as
    // nothing has been created just yet.
    readonly textHighlight: ITextHighlight;
    readonly docMeta: IDocMeta;
    readonly pageMeta: IPageMeta;
}

export interface ITextHighlightRevert extends IAnnotationMutationSelected {
    readonly type: 'revert';
}

export interface ITextHighlightUpdate extends IAnnotationMutationSelected {
    readonly type: 'update';
    readonly body: string;
}

export type ITextHighlightMutation = ITextHighlightCreate | ITextHighlightUpdate | ITextHighlightRevert;

export interface IDeleteMutation extends IAnnotationMutationSelected {

}

export interface IColorMutation {
    readonly color: string;
}

export interface ITaggedMutation extends IAnnotationMutationSelected {
}

export interface IAnnotationMutationCallbacks {

    writeUpdatedDocMetas(updatedDocMetas: ReadonlyArray<IDocMeta>): Promise<void>;

    /**
     * Create a specific callback as a react callback that can be used with a
     * fixed set of selected items.
     */
    readonly createDeletedCallback: (mutation: IDeleteMutation) => Callback;
    /**
     * Delete the given items or whatever is selected.
     */
    readonly onDeleted: (mutation: IDeleteMutation) => void;

    readonly createTaggedCallback: (mutation: ITaggedMutation) => Callback;

    readonly doTagged: (annotations: ReadonlyArray<IDocAnnotationRef>,
                        tags: ReadonlyArray<Tag>,
                        strategy: ComputeNewTagsStrategy) => void;

    readonly onTagged: (mutation: ITaggedMutation) => void;

    readonly onAreaHighlight: (mutation: IAreaHighlightMutation) => void;
    readonly onTextHighlight: (mutation: ITextHighlightMutation) => void;

    readonly createCommentCallback: (selected: IAnnotationMutationSelected) => (mutation: ICommentMutation) => void;

    readonly onComment: (mutation: ICommentMutation & IAnnotationMutationSelected) => void;
    readonly onFlashcard: (mutation: IFlashcardMutation) => void;

    readonly createColorCallback: (selected: IAnnotationMutationSelected) => (mutation: IColorMutation) => void;

    // TODO: in the future it would be nice to pick the color for multiple items
    // but we can't right now.
    readonly onColor: (mutation: IColorMutation & IAnnotationMutationSelected) => void;

}

const AnnotationMutationsContext = React.createContext<IAnnotationMutationCallbacks>({

    writeUpdatedDocMetas: ASYNC_NULL_FUNCTION,

    createDeletedCallback: () => NULL_FUNCTION,
    onDeleted: NULL_FUNCTION,
    onAreaHighlight: NULL_FUNCTION,
    onTextHighlight: NULL_FUNCTION,

    createCommentCallback: () => NULL_FUNCTION,
    onComment: NULL_FUNCTION,

    onFlashcard: NULL_FUNCTION,

    createColorCallback: () => NULL_FUNCTION,
    onColor: NULL_FUNCTION,

    createTaggedCallback: () => NULL_FUNCTION,
    doTagged: NULL_FUNCTION,
    onTagged: NULL_FUNCTION,

});

export function useAnnotationMutationsContext() {
    return useContext(AnnotationMutationsContext);
}

interface IProps {
    readonly value: IAnnotationMutationCallbacks;
    readonly children: React.ReactElement;
}

export const AnnotationMutationsContextProvider = (props: IProps) => {

    return (
        <AnnotationMutationsContext.Provider value={props.value}>
            {props.children}
        </AnnotationMutationsContext.Provider>
    );

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
                CommentActions.delete(pageMeta,
                                      mutation.existing);
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

    export function onAreaHighlight(docMeta: IDocMeta, pageMeta: IPageMeta, mutation: IAreaHighlightMutation) {

        switch (mutation.type) {

            case "update":

                Functions.withTimeout(() => {
                    const {areaHighlight} = mutation;
                    AreaHighlights.update(areaHighlight.id,docMeta, pageMeta, areaHighlight);
                });

                break;

            case "create":

                Functions.withTimeout(() => {
                    const {areaHighlight} = mutation;
                    pageMeta.areaHighlights[areaHighlight.id] = areaHighlight;
                });

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

            case "create":
                break;

        }

    }

    export function onDeleted(docMeta: IDocMeta, pageMeta: IPageMeta, mutation: IDeleteMutation) {

        for (const current of mutation.selected || []) {
            const {pageNum, annotationType} = current;
            AnnotationMutations.delete({docMeta, annotationType, pageNum}, current.original);
        }

    }

}
export namespace AnnotationMutationCallbacks {

    import ComputeNewTagsStrategy = Tags.ComputeNewTagsStrategy;
    import TaggedCallbacksOpts = TaggedCallbacks.TaggedCallbacksOpts;

    /**
     * @param updateStore: Update the store directly.
     * @param refresher called for each mutation to update the store.
     */
    export function create(updateStore: (docMetas: ReadonlyArray<IDocMeta>) => void,
                           refresher: () => void): IAnnotationMutationCallbacks {

        const dialogs = useDialogManager();
        const persistenceLayerContext = usePersistenceLayerContext();
        const docMetaLookupContext = useDocMetaLookupContext();

        const tagsContext = useTagsContext();

        type AnnotationMutator<T extends IAnnotationMutationSelected> = (docMeta: IDocMeta,
                                                                         pageMeta: IPageMeta,
                                                                         mutation: T) => void;

        async function writeUpdatedDocMetas(updatedDocMetas: ReadonlyArray<IDocMeta>) {

            updateStore(updatedDocMetas);

            refresher();

            const {persistenceLayerProvider} = persistenceLayerContext;

            for (const docMeta of updatedDocMetas) {
                const persistenceLayer = persistenceLayerProvider();
                await persistenceLayer.writeDocMeta(docMeta);
            }

        }

        /**
         *
         * @param mutation The mutation to execute along with the annotations.
         * @param annotationMutator The mutator to mutate the annotations.
         */
        async function handleUpdate<T extends IAnnotationMutationSelected>(mutation: T,
                                                                           annotationMutator: AnnotationMutator<T>) {

            const selected = mutation.selected;

            // FIXME: now the major issue is that for the annotation repository
            // view there might be multiple docMetas but for the viewer there's
            // really only one.  We could have a LoadedDocMetaContext in this
            // situation so that we can use the version that's loaded into memory
            // and get it by id OR revert to reading it from the store if
            // necessary but in ALL our current situations we're loading it from
            // memory.  In the main store RepoDocMetaManager will give it to us
            //

            const partitions = arrayStream(selected)
                .partition(annotation => [annotation.fingerprint, docMetaLookupContext.lookup(annotation.fingerprint)!]);

            // *** first we have to apply all the mutations to every annotation in
            // this doc...
            for (const partition of Object.values(partitions)) {
                const docMeta = partition.key;

                for (const annotation of selected) {
                    const pageMeta = DocMetas.getPageMeta(docMeta, annotation.pageNum);
                    annotationMutator(docMeta, pageMeta, {
                        ...mutation,
                        selected: [annotation]
                    });
                }

            }

            // *** now we have to update the store

            const updatedDocMetas = Object.values(partitions)
                                          .map(current => current.key);

            await writeUpdatedDocMetas(updatedDocMetas);

        }

        function doTagged(annotations: ReadonlyArray<IDocAnnotationRef>,
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

                    const {annotationType, pageNum} = current;
                    AnnotationMutations.update({docMeta, annotationType, pageNum},
                                               {...current.original, ...updates});

                }

            }).catch(err => log.error(err));


        }

        function createTaggedCallback(mutation: ITaggedMutation) {

            const opts: TaggedCallbacksOpts<IDocAnnotationRef> = {
                targets: () => mutation.selected,
                tagsProvider: tagsContext.tagsProvider,
                dialogs,
                doTagged
            }

            return TaggedCallbacks.create(opts);

        }

        function onTagged(mutation: ITaggedMutation) {
            createTaggedCallback(mutation)();
        }

        function createDeletedCallback(mutation: IDeleteMutation): Callback {

            return React.useCallback(() => {
                onDeleted(mutation);
            }, []);

        }

        function onDeleted(mutation: IDeleteMutation) {

            // FIXME area highlight delete does NOT remove attachment references...

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

        function doDeleted(annotations: ReadonlyArray<IDocAnnotationRef>) {

            const mutation: IDeleteMutation = {
                selected: annotations
            }

            handleUpdate(mutation, DocAnnotationsMutator.onDeleted)
                .catch(err => log.error(err));

        }

        function onAreaHighlight(mutation: IAreaHighlightMutation) {

            async function doAsync() {

                const {docMeta, pageMeta, areaHighlight, capturedScreenshot, position} = mutation;

                function toAreaHighlightRect() {
                    const rect = Arrays.first(Object.values(areaHighlight.rects));
                    return AreaHighlightRects.createFromRect(rect!);
                }

                const areaHighlightRect = toAreaHighlightRect();

                // this will do the actual mutation of the docMeta
                // DocAnnotationsMutator.onAreaHighlight(mutation.docMeta, mutation.pageMeta, mutation);

                const {persistenceLayerProvider} = persistenceLayerContext;

                const writeOpts: AreaHighlightWriteOpts = {
                    datastore: persistenceLayerProvider(),
                    docMeta,
                    pageMeta,
                    areaHighlight,
                    areaHighlightRect,
                    position,
                    capturedScreenshot
                };

                const writer = AreaHighlights.createWriter(writeOpts);

                const [writtenAreaHighlight, committer] = writer.prepare();

                await committer.commit();

                updateStore([docMeta]);

                refresher();

            }

            doAsync().catch(err => log.error(err));

        }

        function onTextHighlight(mutation: ITextHighlightMutation) {

            switch (mutation.type) {

                case "revert":
                case "update":
                    handleUpdate(mutation, DocAnnotationsMutator.onTextHighlight)
                        .catch(err => log.error(err));
                    break;

                case "create":

                    const {docMeta, pageMeta, textHighlight} = mutation;
                    pageMeta.textHighlights[textHighlight.id] = textHighlight;

                    // FIXME: all these catch() functions need to be handled
                    // with a dialog error.

                    writeUpdatedDocMetas([docMeta])
                        .catch(err => log.error(err));

                    break;


            }

        }

        function createCommentCallback(selected: IAnnotationMutationSelected): Callback1<ICommentMutation> {

            return React.useCallback((mutation: ICommentMutation) => {
                onComment({...selected, ...mutation});
            }, []);

        }

        function onComment(mutation: ICommentMutation) {
            handleUpdate(mutation, DocAnnotationsMutator.onComment)
                .catch(err => log.error(err));
        }

        function onFlashcard(mutation: IFlashcardMutation) {
            handleUpdate(mutation, DocAnnotationsMutator.onFlashcard)
                .catch(err => log.error(err));
        }

        function createColorCallback(selected: IAnnotationMutationSelected): Callback1<IColorMutation> {

            return React.useCallback((mutation: IColorMutation) => {
                onColor({...selected, ...mutation});
            }, []);

        }

        function onColor(colorMutation: IColorMutation & IAnnotationMutationSelected) {

            handleUpdate({selected: colorMutation.selected}, (docMeta, pageMeta, mutation) => {

                for (const current of mutation.selected) {

                    const updates = {
                        color: colorMutation.color
                    };

                    const {annotationType, pageNum} = current;
                    AnnotationMutations.update({docMeta, annotationType, pageNum},
                                               {...current.original, ...updates});

                }

            }).catch(err => log.error(err));

        }

        return {
            writeUpdatedDocMetas,
            createDeletedCallback,
            onDeleted,
            onAreaHighlight,
            onTextHighlight,
            createCommentCallback,
            onComment,
            onFlashcard,
            createColorCallback,
            onColor,
            createTaggedCallback,
            doTagged,
            onTagged,
        };

    }

}

