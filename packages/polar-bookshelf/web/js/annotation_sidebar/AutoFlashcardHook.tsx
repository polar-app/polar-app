import * as React from 'react';
import {IDocAnnotationRef} from "./DocAnnotation";
import {AutoFlashcardRequests} from "../api/AutoFlashcardRequests";
import { useLogger } from '../mui/MUILogger';
import { AutoFlashcards } from 'polar-backend-api/src/api/AutoFlashcards';
import {IFlashcardCreate, useAnnotationMutationsContext} from "./AnnotationMutationsContext";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {Refs} from "polar-shared/src/metadata/Refs";

export type AutoFlashcardHandlerState = 'idle' | 'waiting';

export type AutoFlashcardHandler = () => Promise<void>;

export type AutoFlashcardHandlerTuple = [AutoFlashcardHandlerState, AutoFlashcardHandler];

export function useAutoFlashcardHandler(annotation: IDocAnnotationRef): AutoFlashcardHandlerTuple {

    const log = useLogger();
    const annotationMutations = useAnnotationMutationsContext();
    const flashcardCallback = annotationMutations.createFlashcardCallback(annotation);

    const [state, setState] = React.useState<AutoFlashcardHandlerState>('idle');

    const handler = React.useCallback(async () => {

        // get the currently active flashcards

        if (! annotation.text) {
            console.log("No annotation text")
            return;
        }

        try {

            setState('waiting');

            const response = await AutoFlashcardRequests.exec({query_text: annotation.text});

            if (AutoFlashcards.isError(response)) {
                log.error("Unable to automatically compute flashcard: ", response.error);
                return;
            }

            const fields = {
                front: response.front,
                back: response.back
            };

            const mutation: IFlashcardCreate = {
                type: 'create',
                flashcardType: FlashcardType.BASIC_FRONT_BACK,
                fields,
                parent: Refs.createRef(annotation)
            };

            flashcardCallback(mutation);

        } finally {
            setState('idle');
        }

    }, [annotation, flashcardCallback, log]);

    return [state, handler];

}