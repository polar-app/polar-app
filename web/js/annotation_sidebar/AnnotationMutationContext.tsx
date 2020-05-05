import React, {useContext} from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {IDocAnnotation} from "./DocAnnotation";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FlashcardInputFieldsType} from "./child_annotations/flashcards/flashcard_input/FlashcardInputs";
import {Flashcard} from "../metadata/Flashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";


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
