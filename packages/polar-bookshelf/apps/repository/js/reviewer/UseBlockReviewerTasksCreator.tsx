import React from 'react';
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {IRepoAnnotationContent} from "../block_annotation_repo/BlocksAnnotationRepoStore";
import {RepetitionMode, Task} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {DEFAULT_FLASHCARD_TASKS_LIMIT, DEFAULT_READING_TASKS_LIMIT} from "./ReviewerTasks";
import {ICalculatedTaskReps} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/ICalculatedTaskReps";
import {
    AnnotationContentType,
    IAnnotationHighlightContent,
    IFlashcardAnnotationContent
} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IBlockPredicates} from "../../../../web/js/notes/store/IBlockPredicates";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {Strings} from "polar-shared/src/util/Strings";
import {IFlashcardTaskAction} from "./cards/FlashcardTaskAction";
import {FlashcardTaskActions} from "./cards/FlashcardTaskActions";
import {Reducers} from "polar-shared/src/util/Reducers";
import {useReviewerTasksCreator} from "./UseReviewerTasksCreator";
import {IImageResolver} from "./IImageResolver";
import {IBlockReadingTaskAction} from "./IBlockReadingTaskAction";
import {IBlockFlashcardTaskAction} from "./IBlockFlashcardTaskAction";
import {ITasksBuilder} from "./ITasksBuilder";

export function useBlockReviewerTasksCreator() {

    const reviewerTasksCreator = useReviewerTasksCreator();

    const createReadingTasks = React.useCallback((data: ReadonlyArray<IBlock<IRepoAnnotationContent>>,
                                                         imageResolver: IImageResolver,
                                                         limit: number = DEFAULT_READING_TASKS_LIMIT): ICalculatedTaskReps<IBlockReadingTaskAction> => {

        const mode = 'reading';

        const taskBuilder: ITasksBuilder<IBlock<IRepoAnnotationContent>, IBlockReadingTaskAction> = (blocks) => {

            const toTask = (block: IBlock<IAnnotationHighlightContent>): Task<IBlockReadingTaskAction> => {

                const color = HighlightColors.withDefaultColor(block.content.value.color);
                return {
                    id: block.id,
                    action: {
                        type: 'reading',
                        original: block,
                        created: block.created,
                        updated: block.updated,
                        text: IBlockPredicates.isAnnotationTextHighlightBlock(block)
                            ? BlockTextHighlights.toText(block.content.value)
                            : undefined,
                        img: IBlockPredicates.isAnnotationAreaHighlightBlock(block) && block.content.value.image
                            ? imageResolver(block.content.value.image)
                            : undefined
                    },
                    created: block.created,
                    color,
                    mode
                };
            };

            const isNotEmpty = (block: IBlock<IAnnotationHighlightContent>): boolean => {

                if (block.content.type === AnnotationContentType.AREA_HIGHLIGHT) {
                    return block.content.value.image !== undefined;
                }

                if (block.content.type === AnnotationContentType.TEXT_HIGHLIGHT) {
                    return ! Strings.empty(BlockTextHighlights.toText(block.content.value));
                }

                return false;

            };

            return blocks
                .filter(IBlockPredicates.isAnnotationHighlightBlock)
                .filter(isNotEmpty)
                .map(toTask);

        };

        return reviewerTasksCreator(data, mode, taskBuilder, limit);

    }, [reviewerTasksCreator]);

    const createFlashcardTasks = React.useCallback((data: ReadonlyArray<IBlock<IRepoAnnotationContent>>,
                                                    limit: number = DEFAULT_FLASHCARD_TASKS_LIMIT): ICalculatedTaskReps<IBlockFlashcardTaskAction> => {

        const mode = 'flashcard';

        const taskBuilder: ITasksBuilder<IBlock<IRepoAnnotationContent>, IBlockFlashcardTaskAction> = (repoDocAnnotations) => {

            const toTasks = (block: IBlock<IFlashcardAnnotationContent>): ReadonlyArray<Task<IBlockFlashcardTaskAction>> => {

                const toTask = (action: IBlockFlashcardTaskAction): Task<IFlashcardTaskAction<IBlock<IFlashcardAnnotationContent>>> => {

                    return {
                        id: block.id,
                        action,
                        created: block.created,
                        mode
                    };

                };

                const actions = FlashcardTaskActions.create(block.content.value, block);

                return actions.map(toTask);

            };

            if (repoDocAnnotations.length === 0) {
                // nothing to do.
                return [];
            }

            return repoDocAnnotations
                .filter(IBlockPredicates.isAnnotationFlashcardBlock)
                .map(toTasks)
                .reduce(Reducers.FLAT, []);

        };

        return reviewerTasksCreator(data, mode, taskBuilder, limit);

    }, [reviewerTasksCreator]);

    return React.useCallback((data: ReadonlyArray<IBlock<IRepoAnnotationContent>>,
                              mode: RepetitionMode,
                              imageResolver: IImageResolver,
                              limit?: number) => {

        switch (mode) {
            case 'reading':
                return createReadingTasks(data, imageResolver, limit);
            case 'flashcard':
                return createFlashcardTasks(data, limit);
            default:
                const _: never = mode;
                throw new Error('Unhandled docAnnotation repetition mode');
        }

    }, [createFlashcardTasks, createReadingTasks]);

}

