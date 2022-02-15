import React from "react";
import {AutoClozeDeletionRequests} from "../api/AutoClozeDeletionRequests";
import {AutoClozeDeletions} from 'polar-backend-api/src/api/AutoClozeDeletion';
import {useLogger} from '../mui/MUILogger';
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {useBlocksStore} from "../notes/store/BlocksStore";
import {Analytics} from "../analytics/Analytics";
import {BlockPredicates} from "../notes/store/BlockPredicates";

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
    const blocksStore = useBlocksStore();

    const handler = React.useCallback(async (id: BlockIDStr) => {
        const block = blocksStore.getBlock(id);

        if (! block || ! BlockPredicates.isClozeFlashcardBlock(block)) {
            return console.error('Can\'t use ai cloze deletion with non cloze flashcard blocks');
        }

        const content = block.content.toJSON();

        const { text: clozeText } = await aiClozeDeletionHandler(content.value.fields.text);

        blocksStore.setBlockContent(id, {
            ...content,
            value: {
                ...content.value,
                fields: { text: clozeText }
            }
        });

        Analytics.event2('ai-cloze-deletion');

    }, [blocksStore, aiClozeDeletionHandler]);

    return [state, handler];

}
