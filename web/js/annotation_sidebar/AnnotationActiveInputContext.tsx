import React, {useContext, useMemo, useState} from "react";
import isEqual from "react-fast-compare";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export type AnnotationInputType = 'none' | 'comment' | 'flashcard' | 'text-highlight';

export interface IAnnotationInput {
    readonly active: AnnotationInputType;
    readonly setActive: (active: AnnotationInputType) => void;

    /**
     * Clear all inputs
     */
    readonly reset: () => void;

    readonly createComment: () => void;
    readonly createFlashcard: () => void;
    readonly createTextHighlight: () => void;

}

const AnnotationActiveInputContext = React.createContext<IAnnotationInput>({
    active: 'none',
    reset: NULL_FUNCTION,
    setActive: NULL_FUNCTION,
    createComment: NULL_FUNCTION,
    createFlashcard: NULL_FUNCTION,
    createTextHighlight: NULL_FUNCTION
});

export function useAnnotationActiveInputContext() {
    return useContext(AnnotationActiveInputContext);
}

interface IProps {
    readonly children: JSX.Element;
}

export const AnnotationActiveInputContextProvider = React.memo(function AnnotationActiveInputContextProvider(props: IProps) {

    const [active, setActive] = useState<AnnotationInputType>('none');

    function reset() {
        setActive('none');
    }

    function createComment() {
        setActive('comment');
    }

    function createFlashcard() {
        setActive('comment');
    }

    function createTextHighlight() {
        setActive('text-highlight');
    }

    const value = useMemo<IAnnotationInput>(() => {
        return {
            active,
            setActive,
            reset,
            createComment,
            createFlashcard,
            createTextHighlight
        };
    }, [active]);

    return (
        <AnnotationActiveInputContext.Provider value={value}>
            {props.children}
        </AnnotationActiveInputContext.Provider>
    );

}, isEqual);
