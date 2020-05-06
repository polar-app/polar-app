import React, {useContext} from "react";
import {Functions, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {IDocAnnotation} from "./DocAnnotation";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FlashcardInputFieldsType} from "./child_annotations/flashcards/flashcard_input/FlashcardInputs";
import {Flashcard} from "../metadata/Flashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {FlashcardActions} from "./child_annotations/flashcards/FlashcardActions";
import {
    createObservableStore,
    SetStore
} from "../../spectron0/material-ui/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {usePersistence} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useDialogManager} from "../../spectron0/material-ui/dialogs/MUIDialogControllers";
import {Logger} from "polar-shared/src/logger/Logger";
import {useDocMetaContext} from "./DocMetaContextProvider";
import {CommentActions} from "./child_annotations/comments/CommentActions";
import {IComment} from "polar-shared/src/metadata/IComment";
import {HTMLStr} from "polar-shared/src/util/Strings";
import {TextHighlights} from "../metadata/TextHighlights";
import {Tag} from "polar-shared/src/tags/Tags";

const log = Logger.create()

export interface IAnnotationMutation {

    readonly onTextHighlightReverted: () => void;
    readonly onTextHighlightEdited: () => void;

    readonly onColor: (color: string) => void;

    readonly onCommentCreated: (annotation: IDocAnnotation) => void
    readonly onFlashcardCreated: (flashcardType: FlashcardType,
                                  fields: Readonly<FlashcardInputFieldsType>,
                                  existingFlashcard?: Flashcard) => void;

    readonly onDelete: (annotation: IDocAnnotation) => void;

    readonly onTextHighlightContentRevert: (annotation: IDocAnnotation) => void;
    readonly onTextHighlightContent: (annotation: IDocAnnotation, html: string) => void;


}

export const AnnotationMutationContext = React.createContext<IAnnotationMutation>({
    onTextHighlightEdited: NULL_FUNCTION,
    onTextHighlightReverted: NULL_FUNCTION,
    onColor: NULL_FUNCTION,
    onCommentCreated: NULL_FUNCTION,
    onFlashcardCreated: NULL_FUNCTION,
    onDelete: NULL_FUNCTION,
    onTextHighlightContentRevert: NULL_FUNCTION,
    onTextHighlightContent: NULL_FUNCTION,
});

export interface IAnnotationMutationStore {

}

export interface ICommentCreate {
    readonly type: 'create';
    readonly parent: IDocAnnotation;
    readonly body: HTMLStr;
}

export interface ICommentUpdate {
    readonly type: 'update';
    readonly parent: IDocAnnotation;
    readonly body: HTMLStr;
    readonly existing: IDocAnnotation;
}

export interface ICommentDelete {
    readonly type: 'delete';
    readonly parent: IDocAnnotation;
    readonly existing: IDocAnnotation;
}

export type ICommentMutation = ICommentCreate | ICommentUpdate | ICommentDelete;

export interface IFlashcardCreate {
    readonly type: 'create';
    readonly parent: IDocAnnotation;
    readonly flashcardType: FlashcardType,
    readonly fields: Readonly<FlashcardInputFieldsType>
}

export interface IFlashcardUpdate {
    readonly type: 'update';
    readonly parent: IDocAnnotation;
    readonly flashcardType: FlashcardType,
    readonly fields: Readonly<FlashcardInputFieldsType>
    readonly existing: IDocAnnotation;
}
export interface IFlashcardDelete {
    readonly type: 'delete';
    readonly parent: IDocAnnotation;
    readonly existing: IDocAnnotation;
}

export type IFlashcardMutation = IFlashcardCreate | IFlashcardUpdate | IFlashcardDelete;

export interface ITextHighlightRevert {
    readonly type: 'revert';
    readonly textHighlight: IDocAnnotation;
}

export interface ITextHighlightUpdate {
    readonly type: 'update';
    readonly textHighlight: IDocAnnotation;
    readonly body: string;
}

export type ITextHighlightMutation = ITextHighlightRevert | ITextHighlightUpdate;

export interface IAnnotationMutationCallbacks {

    // readonly doTagged: (annotation: IDocAnnotation, tags: ReadonlyArray<Tag>) => void;
    readonly onTagged: (annotation: IDocAnnotation) => void;

    /**
     * Change the color of an annotation.
     */
    readonly onColor: (annotation: IDocAnnotation, color: string) => void;

    readonly onTextHighlight: (mutation: ITextHighlightMutation) => void
    readonly onComment: (mutation: ICommentMutation) => void
    readonly onFlashcard: (mutation: IFlashcardMutation) => void;

}

const initialStore: IAnnotationMutationStore = {
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IAnnotationMutationStore>,
                        setStore: SetStore<IAnnotationMutationStore>): Mutator {

    return {

    };

}

function callbacksFactory(storeProvider: Provider<IAnnotationMutationStore>,
                          setStore: (store: IAnnotationMutationStore) => void,
                          mutator: Mutator): IAnnotationMutationCallbacks {

    const persistence = usePersistence();
    const dialogs = useDialogManager();
    const docMetaContext = useDocMetaContext();

    async function doWriteDocMeta(docMeta: IDocMeta) {

        // first, set the docMeta so that the UI updates

        docMetaContext.setDoc({...docMetaContext, docMeta});

        const persistenceLayer = persistence.persistenceLayerProvider();
        await persistenceLayer.writeDocMeta(docMeta);

    }

    function onComment(mutation: ICommentMutation) {

        const docMeta = docMetaContext.docMeta;

        switch (mutation.type) {

            case "create":
                CommentActions.create(docMeta,
                                      mutation.parent,
                                      mutation.body);
                break;

            case "update":
                CommentActions.update(docMeta,
                                      mutation.parent,
                                      mutation.body,
                                      mutation.existing.original as IComment);
                break;

            case "delete":
                CommentActions.delete(mutation.existing);

        }

        async function doAsync() {
            await doWriteDocMeta(docMeta);
            log.info("flashcard created");
        }

        doAsync()
            .catch(err => log.error(err));


    }

    function onFlashcard(mutation: IFlashcardMutation) {

        const docMeta = docMetaContext.docMeta;

        switch (mutation.type) {

            case "create":
                FlashcardActions.create(mutation.parent,
                                        mutation.flashcardType,
                                        mutation.fields);
                break;

            case "update":
                FlashcardActions.update(docMeta,
                                        mutation.parent,
                                        mutation.flashcardType,
                                        mutation.fields,
                                        mutation.existing);
                break;

                case "delete":
                    FlashcardActions.delete(docMeta,
                                            mutation.parent,
                                            mutation.existing);

        }

        async function doAsync() {
            await doWriteDocMeta(docMeta);
            log.info("flashcard created");
        }

        doAsync()
            .catch(err => log.error(err));

    }

    function onTextHighlight(mutation: ITextHighlightMutation) {

        const docMeta = docMetaContext.docMeta;

        switch (mutation.type) {
            case "revert":

                Functions.withTimeout(() => {

                    TextHighlights.resetRevisedText(docMeta,
                                                    mutation.textHighlight.pageMeta,
                                                    mutation.textHighlight.id);

                });

                break;
            case "update":

                Functions.withTimeout(() => {

                    TextHighlights.setRevisedText(docMeta,
                                                  mutation.textHighlight.pageMeta,
                                                  mutation.textHighlight.id,
                                                  mutation.body);

                });

                break;


        }

    }

    function onTagged(annotation: IDocAnnotation) {
        // noop
    }

    return {
        onTagged,
        onColor: NULL_FUNCTION,
        onTextHighlight,
        onFlashcard,
        onComment,
    };

}

export function useAnnotationMutationContext() {
    return useContext(AnnotationMutationContext);
}

interface IProps {
    readonly children: JSX.Element;
}

export const [AnnotationMutationStoreProvider, useAnnotationMutationStore, useAnnotationMutationCallbacks, useAnnotationMutationMutator] =
    createObservableStore<IAnnotationMutationStore, Mutator, IAnnotationMutationCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });





// const onTagged = (tags: ReadonlyArray<Tag>) => {
//
//     setTimeout(() => {
//
//         const updates = {tags: Tags.toMap(tags)};
//
//         DocMetas.withBatchedMutations(docMeta, () => {
//
//             AnnotationMutations.update(docMeta,
//                                        annotation.annotationType,
//                                        {...annotation.original, ...updates});
//
//         });
//
//
//     }, 1);
//
// };


// const handleDelete = () => {
//     log.info("Comment deleted: ", comment);
//     delete comment.pageMeta.comments[comment.id];
// }

// private onComment(): void {
//
//     this.props.onComment(this.html, this.props.existingComment);
//
//     this.setState({
//                       iter: this.state.iter + 1
//                   });
//
// }
