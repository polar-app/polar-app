import React, {useContext} from "react";
import {
    ASYNC_NULL_FUNCTION,
    Callback,
    Callback1,
    NULL_FUNCTION
} from "polar-shared/src/util/Functions";
import {IDocAnnotationRef} from "./DocAnnotation";
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
    useRepoDocMetaManager,
    useTagsContext
} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {TaggedCallbacks} from "../../../apps/repository/js/annotation_repo/TaggedCallbacks";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {
    AreaHighlights,
    AreaHighlightWriteOpts
} from "../metadata/AreaHighlights";
import {ICapturedScreenshot} from "../screenshots/Screenshot";
import {Position} from "polar-shared/src/metadata/IBaseHighlight";
import {AreaHighlightRects} from "../metadata/AreaHighlightRects";
import {Arrays} from "polar-shared/src/util/Arrays";
import {useDocMetaLookupContext} from "./DocMetaLookupContextProvider";
import {
    IAnnotationRef,
    IAnnotationRefWithDocMeta
} from "polar-shared/src/metadata/AnnotationRefs";
import {TextType} from "polar-shared/src/metadata/TextType";
import {Texts} from "polar-shared/src/metadata/Texts";
import {useLogger} from "../mui/MUILogger";
import {Preconditions} from "polar-shared/src/Preconditions";
import {DocMetas} from "../metadata/DocMetas";
import ComputeNewTagsStrategy = Tags.ComputeNewTagsStrategy;

export interface IAnnotationMutationHolder<M> {
    readonly annotation: IAnnotationRef;
    readonly mutation: M;
}

export interface IAnnotationMutationHolderWithDocMeta<M> {
    readonly annotation: IAnnotationRefWithDocMeta;
    readonly mutation: M;
}

/**
 * This allows us to specify what's is being mutated.
 */
export interface IAnnotationMutationSelected {
    readonly selected: ReadonlyArray<IAnnotationRef>;
}

export interface IAnnotationMutationSelectedWithDocMeta {
    readonly selected: ReadonlyArray<IAnnotationRefWithDocMeta>;
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
    readonly existing: IDocAnnotationRef;
}

export interface ICommentDelete {
    readonly type: 'delete';
    readonly parent: IRef;
    readonly existing: IDocAnnotationRef;
}

export type ICommentMutation = ICommentCreate | ICommentUpdate | ICommentDelete;

export interface IFlashcardCreate {
    readonly type: 'create';
    readonly parent: IRef;
    readonly flashcardType: FlashcardType,
    readonly fields: Readonly<FlashcardInputFieldsType>
}

export interface IFlashcardUpdate {
    readonly type: 'update';
    readonly parent: IRef;
    readonly flashcardType: FlashcardType,
    readonly fields: Readonly<FlashcardInputFieldsType>;
    readonly existing: IDocAnnotationRef;

}


export interface IFlashcardDelete {
    readonly type: 'delete';
    readonly parent: IRef;
    readonly existing: IDocAnnotationRef;
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

export interface IDeleteMutationWithDocMeta extends IAnnotationMutationSelectedWithDocMeta {

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

    readonly doTagged: (annotations: ReadonlyArray<IAnnotationRef>,
                        tags: ReadonlyArray<Tag>,
                        strategy: ComputeNewTagsStrategy) => void;

    readonly onTagged: (mutation: ITaggedMutation) => void;

    readonly onAreaHighlight: (mutation: IAreaHighlightMutation) => void;
    readonly onTextHighlight: (mutation: ITextHighlightMutation) => void;

    readonly createCommentCallback: (annotation: IAnnotationRef) => (mutation: ICommentMutation) => void;

    readonly onComment: (holders: ReadonlyArray<IAnnotationMutationHolder<ICommentMutation>>) => void;

    readonly createFlashcardCallback: (annotation: IAnnotationRef) => (mutation: IFlashcardMutation) => void;
    readonly onFlashcard: (holders: ReadonlyArray<IAnnotationMutationHolder<IFlashcardMutation>>) => void;

    readonly createColorCallback: (selected: IAnnotationMutationSelected) => (mutation: IColorMutation) => void;

    // TODO: in the future it would be nice to pick the color for multiple items
    // but we can't right now.
    readonly onColor: (mutation: IColorMutation & IAnnotationMutationSelected) => void;

}

function createNullFunction1<V>(functionName: string): (value: V) => void {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (value: V) => {
        console.warn("NULL function called: " + functionName);
    }

}

const AnnotationMutationsContext = React.createContext<IAnnotationMutationCallbacks>({

    writeUpdatedDocMetas: ASYNC_NULL_FUNCTION,

    createDeletedCallback: () => NULL_FUNCTION,
    onDeleted: NULL_FUNCTION,
    onAreaHighlight: createNullFunction1('onAreaHighlight'),
    onTextHighlight: createNullFunction1('onTextHighlight'),

    createCommentCallback: () => NULL_FUNCTION,
    onComment: NULL_FUNCTION,

    createFlashcardCallback: () => NULL_FUNCTION,
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

    export function onComment(holder: IAnnotationMutationHolderWithDocMeta<ICommentMutation>) {

        const {mutation, annotation} = holder;
        const {docMeta, pageNum} = annotation;
        const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

        switch (mutation.type) {

            case "create":
                CommentActions.create(docMeta,
                                      pageMeta,
                                      mutation.parent,
                                      mutation.body);
                break;

            case "update":

                const existing = mutation.existing.original as IComment;
                const content = Texts.create(mutation.body, TextType.HTML);

                const updatedComment: IComment = {
                    ...existing,
                    content
                };

                AnnotationMutations.update(annotation, updatedComment);

                break;

            case "delete":
                CommentActions.delete(pageMeta,
                                      mutation.existing);
                break;

        }

    }

    export function onFlashcard(holder: IAnnotationMutationHolderWithDocMeta<IFlashcardMutation>) {

        const {mutation, annotation} = holder;
        const {docMeta, pageNum} = annotation;
        const pageMeta = DocMetas.getPageMeta(docMeta, pageNum);

        switch (mutation.type) {

            case "create":
                FlashcardActions.create(mutation.parent,
                                        pageMeta,
                                        mutation.flashcardType,
                                        mutation.fields);
                break;

            case "update":

                FlashcardActions.update(docMeta,
                                        pageMeta,
                                        mutation.parent,
                                        mutation.flashcardType,
                                        mutation.fields,
                                        mutation.existing.id);

                break;

            case "delete":
                FlashcardActions.delete(docMeta,
                                        pageMeta,
                                        mutation.parent,
                                        mutation.existing.id);
                break;

        }

    }

    export function onAreaHighlight(docMeta: IDocMeta,
                                    pageMeta: IPageMeta,
                                    mutation: IAreaHighlightMutation) {

        const {areaHighlight} = mutation;

        switch (mutation.type) {

            case "update":

                AreaHighlights.update(areaHighlight.id, docMeta, pageMeta, areaHighlight);

                break;

            case "create":

                pageMeta.areaHighlights[areaHighlight.id] = areaHighlight;

                break;

        }

    }

    export function onTextHighlight(docMeta: IDocMeta, pageMeta: IPageMeta, mutation: ITextHighlightMutation) {

        switch (mutation.type) {
            case "revert":

                for (const textHighlight of (mutation.selected || [])) {
                    TextHighlights.resetRevisedText(docMeta,
                                                    pageMeta,
                                                    textHighlight.id);
                }

                break;

            case "update":

                for (const textHighlight of (mutation.selected || [])) {

                    TextHighlights.setRevisedText(docMeta,
                                                  pageMeta,
                                                  textHighlight.id,
                                                  mutation.body);
                }
                break;

            case "create":
                break;

        }

    }

    export function onDeleted(docMeta: IDocMeta, pageMeta: IPageMeta, mutation: IDeleteMutationWithDocMeta) {

        for (const current of mutation.selected || []) {
            console.log("Deleting annotation: ", current);
            AnnotationMutations.delete(current);
        }

    }

}

