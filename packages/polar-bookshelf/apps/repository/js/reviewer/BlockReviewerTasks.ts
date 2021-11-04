import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {Img} from "polar-shared/src/metadata/Img";
import {AnnotationContentType, IAnnotationHighlightContent, IFlashcardAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IImage} from "polar-shared/src/metadata/IImage";
import {Reducers} from "polar-shared/src/util/Reducers";
import {Strings} from "polar-shared/src/util/Strings";
import {RepetitionMode, Task} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {CalculatedTaskReps} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {IBlockPredicates} from "../../../../web/js/notes/store/IBlockPredicates";
import {IFlashcardTaskAction} from "./cards/FlashcardTaskAction";
import {FlashcardTaskActions} from "./cards/FlashcardTaskActions";
import {IReadingTaskAction} from "./cards/ReadingTaskAction";
import {DEFAULT_FLASHCARD_TASKS_LIMIT, DEFAULT_READING_TASKS_LIMIT, ReviewerTasks, TasksBuilder} from "./ReviewerTasks";
import {IRepoAnnotationContent} from "../block_annotation_repo/BlocksAnnotationRepoStore";


export type IBlockReadingTaskAction = IReadingTaskAction<IBlock<IAnnotationHighlightContent>>;
export type IBlockFlashcardTaskAction = IFlashcardTaskAction<IBlock<IFlashcardAnnotationContent>>;

export type IBlockTaskAction = IBlockReadingTaskAction | IBlockFlashcardTaskAction;

export type IImageResolver = (image: IImage) => Img | undefined;

export class BlockReviewerTasks {

    public static async createReadingTasks(data: ReadonlyArray<IBlock<IRepoAnnotationContent>>,
                                           imageResolver: IImageResolver,
                                           limit: number = DEFAULT_READING_TASKS_LIMIT): Promise<CalculatedTaskReps<IBlockReadingTaskAction>> {

        const mode = 'reading';

        const taskBuilder: TasksBuilder<IBlock<IRepoAnnotationContent>, IBlockReadingTaskAction> = (blocks) => {

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

        return ReviewerTasks.createTasks(data, mode, taskBuilder, limit);

    }

    public static async createFlashcardTasks(data: ReadonlyArray<IBlock<IRepoAnnotationContent>>,
                                             limit: number = DEFAULT_FLASHCARD_TASKS_LIMIT): Promise<CalculatedTaskReps<IBlockFlashcardTaskAction>> {

        const mode = 'flashcard';

        const taskBuilder: TasksBuilder<IBlock<IRepoAnnotationContent>, IBlockFlashcardTaskAction> = (repoDocAnnotations) => {

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

        return ReviewerTasks.createTasks(data, mode, taskBuilder, limit);

    }

    public static async createTasks(data: ReadonlyArray<IBlock<IRepoAnnotationContent>>,
                                    mode: RepetitionMode,
                                    imageResolver: IImageResolver,
                                    limit?: number): Promise<CalculatedTaskReps<IBlockTaskAction>> {
        switch (mode) {
            case 'flashcard':
                return this.createFlashcardTasks(data, limit);
            case 'reading':
                return this.createReadingTasks(data, imageResolver, limit);
            default:
                const _: never = mode;
                throw new Error('Unhandled docAnnotation repetition mode');
        }
    }
}

