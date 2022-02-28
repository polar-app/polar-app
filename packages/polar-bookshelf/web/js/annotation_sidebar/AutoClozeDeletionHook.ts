import React from "react";
import {AutoClozeDeletionRequests} from "../api/AutoClozeDeletionRequests";
import {AutoClozeDeletions} from 'polar-backend-api/src/api/AutoClozeDeletion';
import {useLogger} from '../mui/MUILogger';
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {Analytics} from "../analytics/Analytics";
import {useAnnotationBlockManager} from "../notes/HighlightBlocksHooks";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";

export type IAutoClozeDeletionHandlerState = 'idle' | 'waiting';

export type IAutoClozeDeletionHandler = (text: string) => Promise<{ text: string }>;
export type IAutoClozeDeletionCreator = () => Promise<void>;

export type IAutoClozeDeletionHandlerTuple = [IAutoClozeDeletionHandlerState, IAutoClozeDeletionHandler];

export function useAIClozeDeletion(): IAutoClozeDeletionHandlerTuple {
    const log = useLogger();
    const [state, setState] = React.useState<IAutoClozeDeletionHandlerState>('idle');

    const handler = React.useCallback(async (text: string) => {

        try {

            setState('waiting');

            const response = await AutoClozeDeletionRequests.exec({ text });

            if (AutoClozeDeletions.isError(response)) {
                log.error("Unable to automatically compute flashcard: ", response.error);
                throw response;
            }

            return {
                text: response.text
            };

        } finally {
            setState('idle');
        }

    }, [setState, log]);

    return [state, handler];
}

export type IAutoClozeDeletion = (id: BlockIDStr) => Promise<void>;
export type IAutoClozeDeletionTuple = [IAutoClozeDeletionHandlerState, IAutoClozeDeletion];

export function useAutoClozeDeletionBlock(): IAutoClozeDeletionTuple {

    const [state, aiClozeDeletionHandler] = useAIClozeDeletion();
    const { getBlock, createFlashcard } = useAnnotationBlockManager();

    const handler = React.useCallback(async (parentID: BlockIDStr) => {
        const block = getBlock(parentID, AnnotationContentType.TEXT_HIGHLIGHT);

        if (! block) {
            return;
        }

        const content = block.content.toJSON();

        const { text: clozeText } = await aiClozeDeletionHandler(BlockTextHighlights.toText(content.value));

        createFlashcard(parentID, {
            type: FlashcardType.CLOZE,
            text: clozeText,
        });

        Analytics.event2('ai-cloze-deletion');

    }, [getBlock, createFlashcard, aiClozeDeletionHandler]);

    return [state, handler];

}
