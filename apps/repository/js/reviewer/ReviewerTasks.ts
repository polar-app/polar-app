import {RepoAnnotation} from "../RepoAnnotation";
import {
    createDefaultTaskRepResolver,
    OptionalTaskRepResolver,
    ReadingTaskAction,
    Task,
    TaskRep,
    TasksCalculator
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {SpacedReps} from "polar-firebase/src/firebase/om/SpacedReps";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {RepetitionMode} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {FlashcardTaskAction} from "./FlashcardTaskAction";
import {FlashcardTaskActions} from "./FlashcardTaskActions";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";

/**
 * Take tasks and then build a
 */
export interface TasksBuilder<A> {
    (repoDocAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<Task<A>>;
}

export class ReviewerTasks {

    public static async createReadingTasks(repoDocAnnotations: ReadonlyArray<RepoAnnotation>,
                                           limit: number = 10): Promise<ReadonlyArray<TaskRep<ReadingTaskAction>>> {

        const mode = 'reading';

        const taskBuilder: TasksBuilder<ReadingTaskAction> = (repoDocAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<Task<ReadingTaskAction>> => {

            const toTask = (repoAnnotation: RepoAnnotation): Task<ReadingTaskAction> => {
                const color = HighlightColors.withDefaultColor((repoAnnotation.meta || {}).color);
                return {
                    id: repoAnnotation.id,
                    action: repoAnnotation.text || "",
                    created: repoAnnotation.created,
                    color,
                    mode
                };
            };

            return repoDocAnnotations
                .filter(current => current.type === AnnotationType.TEXT_HIGHLIGHT)
                .filter(current => current.text !== undefined && current.text !== '')
                .map(toTask);

        };

        return this.createTasks(repoDocAnnotations, mode, taskBuilder, limit);

    }

    public static async createFlashcardTasks(repoDocAnnotations: ReadonlyArray<RepoAnnotation>,
                                             limit: number = 10): Promise<ReadonlyArray<TaskRep<FlashcardTaskAction>>> {

        const mode = 'flashcard';

        const taskBuilder: TasksBuilder<FlashcardTaskAction> = (repoDocAnnotations: ReadonlyArray<RepoAnnotation>): ReadonlyArray<Task<FlashcardTaskAction>> => {

            return repoDocAnnotations
                .filter(current => current.type === AnnotationType.FLASHCARD)
                .map(current => current.original)
                .map(current => FlashcardTaskActions.create(<IFlashcard>current))
                .flat();

        };

        return this.createTasks(repoDocAnnotations, mode, taskBuilder, limit);

    }

    public static async createTasks<A>(repoDocAnnotations: ReadonlyArray<RepoAnnotation>,
                                       mode: RepetitionMode,
                                       tasksBuilder: TasksBuilder<A>,
                                       limit: number = 10): Promise<ReadonlyArray<TaskRep<A>>> {

        // TODO: we also need to be able to review images.... we also need a dedicated provider to
        // return the right type of annotation type...

        const potential: ReadonlyArray<Task<A>> = tasksBuilder(repoDocAnnotations);
        const uid = await Firebase.currentUserID();

        if (! uid) {
            throw new Error("Not authenticated");
        }

        const spacedReps = await SpacedReps.list(uid);

        const spacedRepsMap = IDMaps.toIDMap(spacedReps);

        const optionalTaskRepResolver: OptionalTaskRepResolver<A>
            = async (task: Task<A>): Promise<TaskRep<A> | undefined> => {

            const spacedRep = spacedRepsMap[task.id];

            if (! spacedRep) {
                return undefined;
            }

            const age = TasksCalculator.computeAge(spacedRep);

            return {...task, ...spacedRep, age};

        };

        const resolver = createDefaultTaskRepResolver(optionalTaskRepResolver);

        return await TasksCalculator.calculate({
            potential,
            resolver,
            limit
        });

    }

}
