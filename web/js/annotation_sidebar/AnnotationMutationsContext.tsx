import React, {useContext} from "react";
import {
    Callback,
    Functions,
    NULL_FUNCTION
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

export type IDeleteMutationWithSelected = IDeleteMutation & IAnnotationMutationSelectedRequired;

export interface IColorMutation {
    readonly color: string;
}

export interface ITaggedMutation extends IAnnotationMutationSelected {
}

export interface IAnnotationMutations {

    /**
     * Create a specific callback as a react callback that can be used with a
     * fixed set of selected items.
     */
    readonly createDeletedCallback: (mutation: IDeleteMutationWithSelected) => Callback;
    /**
     * Delete the given items or whatever is selected.
     */
    readonly onDeleted: (mutation?: IDeleteMutation) => void;

    readonly createTaggedCallback: (mutation: IDeleteMutationWithSelected) => Callback;
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

export const AnnotationMutationsContext = React.createContext<IAnnotationMutations>({

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
