import React, {useContext} from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
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
import {AnnotationMutations} from "polar-shared/src/metadata/mutations/AnnotationMutations";
import {useDocMetaContext} from "./DocMetaContextProvider";
import {CommentActions} from "./child_annotations/comments/CommentActions";
import {IComment} from "polar-shared/src/metadata/IComment";

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

export interface IAnnotationMutationCallbacks {

    readonly onTextHighlightReverted: () => void;
    readonly onTextHighlightEdited: () => void;

    readonly onColor: (color: string) => void;

    readonly onCommentCreated: (annotation: IDocAnnotation) => void
    readonly onFlashcardCreated: (flashcardType: FlashcardType,
                                  fields: Readonly<FlashcardInputFieldsType>,
                                  existingFlashcard?: Flashcard) => void;

    readonly onUpdate: (annotation: IDocAnnotation) => void;

    readonly onDelete: (annotation: IDocAnnotation) => void;

    readonly onTextHighlightContentRevert: (annotation: IDocAnnotation) => void;
    readonly onTextHighlightContent: (annotation: IDocAnnotation, html: string) => void;

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

    function onDelete(annotation: IDocAnnotation, docMeta: IDocMeta = docMetaContext.docMeta) {

        // TODO: should we copy/clone the DocMeta object first?
        AnnotationMutations.delete(docMeta, annotation.annotationType, annotation.original);

        async function doAsync() {
            await doWriteDocMeta(docMeta);
            log.info("Annotation deleted: ", annotation);
        }

        doAsync().catch(err => log.error(err));

    }

    function onUpdate(annotation: IDocAnnotation, docMeta: IDocMeta = docMetaContext.docMeta) {

        // TODO: should we copy/clone the DocMeta object first?
        AnnotationMutations.update(docMeta, annotation.annotationType, annotation.original);

        async function doAsync() {
            await doWriteDocMeta(docMeta);
            log.info("Annotation deleted: ", annotation);
        }

        doAsync().catch(err => log.error(err));

    }

    function onCommentUpdated(html: string,
                              parent: IDocAnnotation,
                              existingComment: IComment) {

        const docMeta = docMetaContext.docMeta;
        CommentActions.update(docMeta, parent, html, existingComment);

        async function doAsync() {
            await doWriteDocMeta(docMeta);
            log.info("comment updated");
        }

        doAsync()
            .catch(err => log.error(err));

    }

    function onFlashcardCreated(parent: IDocAnnotation,
                                flashcardType: FlashcardType,
                                fields: Readonly<FlashcardInputFieldsType>) {

        const docMeta = docMetaContext.docMeta;
        FlashcardActions.create(parent, flashcardType, fields);

        async function doAsync() {
            await doWriteDocMeta(docMeta);
            log.info("flashcard created");
        }

        doAsync()
            .catch(err => log.error(err));

    }

    function onFlashcardUpdated(parent: IDocAnnotation,
                                flashcardType: FlashcardType,
                                fields: Readonly<FlashcardInputFieldsType>,
                                existingFlashcard: Flashcard) {

        const docMeta = docMetaContext.docMeta;
        FlashcardActions.update(docMeta, parent, flashcardType, fields, existingFlashcard);

        async function doAsync() {
            await doWriteDocMeta(docMeta);
            log.info("flashcard updated");
        }

        doAsync()
            .catch(err => log.error(err));

    }

    return {
        onTextHighlightEdited: NULL_FUNCTION,
        onTextHighlightReverted: NULL_FUNCTION,
        onColor: NULL_FUNCTION,
        onCommentCreated: NULL_FUNCTION,
        onFlashcardCreated: NULL_FUNCTION,
        onUpdate,
        onDelete,
        onTextHighlightContentRevert: NULL_FUNCTION,
        onTextHighlightContent: NULL_FUNCTION,
    };

}

export function useAnnotationMutationContext() {
    return useContext(AnnotationMutationContext);
}

interface IProps {
    readonly children: JSX.Element;
}

createObservableStore<IAnnotationMutationStore, Mutator, IAnnotationMutationCallbacks>({
    initialValue: initialStore,
    mutatorFactory,
    callbacksFactory
});



// export const AnnotationMutationContextProvider = React.memo((props: IProps) => {
//
//     return (
//         <AnnotationMutationContext.Provider value={{active, setActive}}>
//             {props.children}
//         </AnnotationMutationContext.Provider>
//     );
//
// }, isEqual);
//
// private onComment(html: string, existingComment: Comment) {
//     CommentActions.update(this.props.doc.docMeta, this.props.parent, html, existingComment);
// }
//


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
