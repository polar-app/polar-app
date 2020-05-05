import React, {useContext} from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {IDocAnnotation} from "./DocAnnotation";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";


export interface IAnnotationMutation {
    readonly onCommentCreated: (html: string) => void;

    readonly onTextHighlightReverted: () => void;
    readonly onTextHighlightEdited: () => void;
    readonly onFlashcardCreated: () => void;

    readonly onColor: (color: string) => void;

    readonly onComment: (annotation: IDocAnnotation) => void
    readonly onDelete: (annotation: IDocAnnotation) => void;

}

export const AnnotationMutationContext = React.createContext<IAnnotationMutation>({
    onCommentCreated: NULL_FUNCTION,
    onTextHighlightEdited: NULL_FUNCTION,
    onTextHighlightReverted: NULL_FUNCTION,
    onFlashcardCreated: NULL_FUNCTION,
    onColor: NULL_FUNCTION,
    onComment: NULL_FUNCTION,
    onDelete: NULL_FUNCTION
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
