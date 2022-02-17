import * as React from 'react';
import {AutoFlashcardRequests} from "../api/AutoFlashcardRequests";
import {AutoFlashcards} from 'polar-backend-api/src/api/AutoFlashcards';
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {Analytics} from "../analytics/Analytics";
import {BlockIDStr} from 'polar-blocks/src/blocks/IBlock';
import {useAnnotationBlockManager} from '../notes/HighlightBlocksHooks';
import {useErrorHandler} from "../mui/MUIErrorHandler";

export type IAutoFlashcardHandlerState = 'idle' | 'waiting';

export type IAutoFlashcardHandler = (text: string) => Promise<{ front: string, back: string }>;
export type IAutoFlashcardCreator = () => Promise<void>;

export type IAutoFlashcardHandlerTuple = [IAutoFlashcardHandlerState, IAutoFlashcardHandler];

export function useAIFlashcardHandler(): IAutoFlashcardHandlerTuple  {
    const errorHandler = useErrorHandler();
    const [state, setState] = React.useState<IAutoFlashcardHandlerState>('idle');

    const handler = React.useCallback(async (text: string) => {

        try {

            setState('waiting');

            const response = await AutoFlashcardRequests.exec({ query_text: text });

            if (AutoFlashcards.isError(response)) {
                errorHandler("Unable to automatically compute flashcard: ", response.error);
                throw response;
            }

            return {
                front: response.front,
                back: response.back
            };

        } finally {
            setState('idle');
        }

    }, [setState, errorHandler]);

    return [state, handler];
}

export type IAutoFlashcardBlockCreator = (parentID: BlockIDStr, text: string) => Promise<void>;
export type IAutoFlashcardBlockCreatorTuple = [IAutoFlashcardHandlerState, IAutoFlashcardBlockCreator];

export function useAutoFlashcardBlockCreator(): IAutoFlashcardBlockCreatorTuple {

    const [state, aiFlashcardHandler] = useAIFlashcardHandler();
    const { createFlashcard } = useAnnotationBlockManager();

    const handler = React.useCallback(async (parentID: BlockIDStr, text: string) => {

        const fields = await aiFlashcardHandler(text);

        createFlashcard(parentID, {
            type: FlashcardType.BASIC_FRONT_BACK,
            ...fields,
        });

        Analytics.event2('ai-flashcard-created');

    }, [createFlashcard, aiFlashcardHandler]);

    return [state, handler];

}
