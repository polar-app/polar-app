import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {ReadingTaskAction} from "./cards/ReadingTaskAction";
import {Strings} from "polar-shared/src/util/Strings";
import {FlashcardTaskAction} from "./cards/FlashcardTaskAction";
import {FlashcardTaskActions} from "./cards/FlashcardTaskActions";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {Reducers} from "polar-shared/src/util/Reducers";
import {DEFAULT_FLASHCARD_TASKS_LIMIT, DEFAULT_READING_TASKS_LIMIT, ReviewerTasks, TasksBuilder} from "./ReviewerTasks";
import {CalculatedTaskReps} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {RepetitionMode, Task, TaskRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";

export type DocAnnotationReadingTaskAction = ReadingTaskAction<IDocAnnotation>;
export type DocAnnotationFlashcardTaskAction = FlashcardTaskAction<IDocAnnotation>;

export type DocAnnotationTaskAction = DocAnnotationReadingTaskAction | DocAnnotationFlashcardTaskAction;


export namespace DocAnnotationTaskActionPredicates {
    export function isReadingTaskRep(taskRep: TaskRep<DocAnnotationTaskAction>): taskRep is TaskRep<DocAnnotationReadingTaskAction> {
        return taskRep.action.type === 'reading';
    }

    export function isFlashcardTaskRep(taskRep: TaskRep<DocAnnotationTaskAction>): taskRep is TaskRep<DocAnnotationFlashcardTaskAction> {
        return taskRep.action.type === 'flashcard';
    }
}

export class DocAnnotationReviewerTasks {

    public static async createReadingTasks(data: ReadonlyArray<IDocAnnotation>,
                                           limit: number = DEFAULT_READING_TASKS_LIMIT): Promise<CalculatedTaskReps<DocAnnotationReadingTaskAction>> {

        const mode = 'reading';

        const taskBuilder: TasksBuilder<IDocAnnotation, DocAnnotationReadingTaskAction> = (docAnnotations: ReadonlyArray<IDocAnnotation>): ReadonlyArray<Task<DocAnnotationReadingTaskAction>> => {

            const toTask = (docAnnotation: IDocAnnotation): Task<DocAnnotationReadingTaskAction> => {
                const color = HighlightColors.withDefaultColor(docAnnotation.color);
                return {
                    id: docAnnotation.guid || docAnnotation.id,
                    action: {
                        type: 'reading',
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
                                             limit: number = DEFAULT_FLASHCARD_TASKS_LIMIT): Promise<CalculatedTaskReps<DocAnnotationFlashcardTaskAction>> {

        const mode = 'flashcard';

        const taskBuilder: TasksBuilder<IDocAnnotation, DocAnnotationFlashcardTaskAction> = (repoDocAnnotations: ReadonlyArray<IDocAnnotation>): ReadonlyArray<Task<FlashcardTaskAction<IDocAnnotation>>> => {

            const toTasks = (docAnnotation: IDocAnnotation): ReadonlyArray<Task<DocAnnotationFlashcardTaskAction>> => {

                const toTask = (action: DocAnnotationFlashcardTaskAction): Task<FlashcardTaskAction<IDocAnnotation>> => {

                    return {
                        id: docAnnotation.guid || docAnnotation.id,
                        action,
                        created: docAnnotation.created,
                        mode
                    };

                };

                const actions = FlashcardTaskActions.create(<IFlashcard> docAnnotation.original, docAnnotation);

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
                                    limit?: number): Promise<CalculatedTaskReps<DocAnnotationTaskAction>> {
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

