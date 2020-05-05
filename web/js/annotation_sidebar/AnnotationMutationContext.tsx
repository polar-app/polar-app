import React, {useContext} from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {IDocAnnotation} from "./DocAnnotation";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FlashcardInputFieldsType} from "./child_annotations/flashcards/flashcard_input/FlashcardInputs";
import {Flashcard} from "../metadata/Flashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {Comment} from "../metadata/Comment";
import {CommentActions} from "./child_annotations/comments/CommentActions";
import {FlashcardActions} from "./child_annotations/flashcards/FlashcardActions";
import {DocMetas} from "../metadata/DocMetas";


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

export function useAnnotationMutationContext() {
    return useContext(AnnotationMutationContext);
}

interface IProps {
    readonly children: JSX.Element;
}

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
// private onFlashcard(flashcardType: FlashcardType, fields: Readonly<FlashcardInputFieldsType>, existingFlashcard?: Flashcard) {
//     FlashcardActions.update(this.props.doc.docMeta, this.props.parent, flashcardType, fields, existingFlashcard);
// }


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
