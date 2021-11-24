import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {IReadingTaskAction} from "./cards/ReadingTaskAction";
import {Strings} from "polar-shared/src/util/Strings";
import {IFlashcardTaskAction} from "./cards/FlashcardTaskAction";
import {FlashcardTaskActions} from "./cards/FlashcardTaskActions";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {Reducers} from "polar-shared/src/util/Reducers";
import {DEFAULT_FLASHCARD_TASKS_LIMIT, DEFAULT_READING_TASKS_LIMIT, ReviewerTasks, TasksBuilder} from "./ReviewerTasks";
import {CalculatedTaskReps} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RepetitionMode, Task} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {BlockContentAnnotationTree} from "polar-migration-block-annotations/src/BlockContentAnnotationTree";

export type IDocAnnotationReadingTaskAction = IReadingTaskAction<IDocAnnotation>;
export type IDocAnnotationFlashcardTaskAction = IFlashcardTaskAction<IDocAnnotation>;

export type IDocAnnotationTaskAction = IDocAnnotationReadingTaskAction | IDocAnnotationFlashcardTaskAction;

/**
 * @deprecated
 */
export class DocAnnotationReviewerTasks {

    public static async createReadingTasks(data: ReadonlyArray<IDocAnnotation>,
                                           limit: number = DEFAULT_READING_TASKS_LIMIT): Promise<CalculatedTaskReps<IDocAnnotationReadingTaskAction>> {

        const mode = 'reading';

        const taskBuilder: TasksBuilder<IDocAnnotation, IDocAnnotationReadingTaskAction> = (docAnnotations: ReadonlyArray<IDocAnnotation>): ReadonlyArray<Task<IDocAnnotationReadingTaskAction>> => {

            const toTask = (docAnnotation: IDocAnnotation): Task<IDocAnnotationReadingTaskAction> => {
                const color = HighlightColors.withDefaultColor(docAnnotation.color);
                return {
                    id: docAnnotation.guid || docAnnotation.id,
                    action: {
                        type: 'reading',
                        created: docAnnotation.created,
                        img: docAnnotation.img,
                        text: docAnnotation.text,
                        updated: docAnnotation.lastUpdated,
                        original: docAnnotation,
                    },
                    created: docAnnotation.created,
                    color,
                    mode
                };
            };

            const predicate = (annotation: IDocAnnotation): boolean => {

                if (annotation.annotationType === AnnotationType.AREA_HIGHLIGHT) {
                    return annotation.img !== undefined;
                }

                if (annotation.annotationType === AnnotationType.TEXT_HIGHLIGHT) {
                    return ! Strings.empty(annotation.text);
                }

                return false;

            };

            return docAnnotations
                .filter(predicate)
                .map(toTask);

        };

        return ReviewerTasks.createTasks(data, mode, taskBuilder, limit);

    }

    public static async createFlashcardTasks(data: ReadonlyArray<IDocAnnotation>,
                                             limit: number = DEFAULT_FLASHCARD_TASKS_LIMIT): Promise<CalculatedTaskReps<IDocAnnotationFlashcardTaskAction>> {

        const mode = 'flashcard';

        const taskBuilder: TasksBuilder<IDocAnnotation, IDocAnnotationFlashcardTaskAction> = (repoDocAnnotations) => {

            const toTasks = (docAnnotation: IDocAnnotation): ReadonlyArray<Task<IDocAnnotationFlashcardTaskAction>> => {

                const toTask = (action: IDocAnnotationFlashcardTaskAction): Task<IFlashcardTaskAction<IDocAnnotation>> => {

                    return {
                        id: docAnnotation.guid || docAnnotation.id,
                        action,
                        created: docAnnotation.created,
                        mode
                    };

                };

                const blockFlashcard = BlockContentAnnotationTree
                    .annotationToBlockFlashcard(<IFlashcard> docAnnotation.original);

                const actions = FlashcardTaskActions.create(blockFlashcard, docAnnotation);

                return actions.map(toTask);

            };

            if (repoDocAnnotations.length === 0) {
                // nothing to do.
                return [];
            }

            return repoDocAnnotations
                .filter(current => current.annotationType === AnnotationType.FLASHCARD)
                .map(toTasks)
                .reduce(Reducers.FLAT, []);

        };

        return ReviewerTasks.createTasks(data, mode, taskBuilder, limit);

    }

    public static async createTasks(data: ReadonlyArray<IDocAnnotation>,
                                    mode: RepetitionMode,
                                    limit?: number): Promise<CalculatedTaskReps<IDocAnnotationTaskAction>> {
        switch (mode) {
            case 'flashcard':
                return this.createFlashcardTasks(data, limit);
            case 'reading':
                return this.createReadingTasks(data, limit);
            default:
                const _: never = mode;
                throw new Error('Unhandled docAnnotation repetition mode');
        }
    }
}

