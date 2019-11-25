import {
    CalculatedTaskReps,
    createDefaultTaskRepResolver,
    OptionalTaskRepResolver,
    TasksCalculator
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {SpacedReps} from "polar-firebase/src/firebase/om/SpacedReps";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {Firebase} from "../../../../web/js/firebase/Firebase";
import {RepetitionMode, Task, TaskRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {FlashcardTaskAction} from "./cards/FlashcardTaskAction";
import {FlashcardTaskActions} from "./cards/FlashcardTaskActions";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {Preconditions} from "polar-shared/src/Preconditions";
import {Reducers} from "polar-shared/src/util/Reducers";
import {SpacedRepStats} from "polar-firebase/src/firebase/om/SpacedRepStats";
import {FirestoreCollections} from "./FirestoreCollections";
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {ReadingTaskAction} from "./cards/ReadingTaskAction";

/**
 * Take tasks and then build a
 */
export interface TasksBuilder<A> {
    (repoDocAnnotations: ReadonlyArray<IDocAnnotation>): ReadonlyArray<Task<A>>;
}

export class ReviewerTasks {

    public static async createReadingTasks(repoDocAnnotations: ReadonlyArray<IDocAnnotation>,
                                           limit: number = 10): Promise<CalculatedTaskReps<ReadingTaskAction>> {

        const mode = 'reading';

        const taskBuilder: TasksBuilder<ReadingTaskAction> = (repoDocAnnotations: ReadonlyArray<IDocAnnotation>): ReadonlyArray<Task<ReadingTaskAction>> => {

            const toTask = (docAnnotation: IDocAnnotation): Task<ReadingTaskAction> => {
                const color = HighlightColors.withDefaultColor(docAnnotation.color);
                return {
                    id: docAnnotation.guid,
                    action: {
                        text: docAnnotation.text || ""
                    },
                    created: docAnnotation.created,
                    color,
                    mode
                };
            };

            return repoDocAnnotations
                .filter(current => current.annotationType === AnnotationType.TEXT_HIGHLIGHT)
                .filter(current => current.text !== undefined && current.text !== '')
                .map(toTask);

        };

        return this.createTasks(repoDocAnnotations, mode, taskBuilder, limit);

    }

    public static async createFlashcardTasks(repoDocAnnotations: ReadonlyArray<IDocAnnotation>,
                                             limit: number = 10): Promise<CalculatedTaskReps<FlashcardTaskAction>> {

        const mode = 'flashcard';

        const taskBuilder: TasksBuilder<FlashcardTaskAction> = (repoDocAnnotations: ReadonlyArray<IDocAnnotation>): ReadonlyArray<Task<FlashcardTaskAction>> => {

            const toTasks = (docAnnotation: IDocAnnotation): ReadonlyArray<Task<FlashcardTaskAction>> => {

                const toTask = (action: FlashcardTaskAction): Task<FlashcardTaskAction> => {

                    return {
                        id: docAnnotation.guid,
                        action,
                        created: docAnnotation.created,
                        mode
                    };

                };

                const actions = FlashcardTaskActions.create(<IFlashcard> docAnnotation.original);

                return actions.map(toTask);

            };

            return repoDocAnnotations
                .filter(current => current.annotationType === AnnotationType.FLASHCARD)
                .map(toTasks)
                .reduce(Reducers.FLAT);

        };

        return this.createTasks(repoDocAnnotations, mode, taskBuilder, limit);

    }

    public static async createTasks<A>(repoDocAnnotations: ReadonlyArray<IDocAnnotation>,
                                       mode: RepetitionMode,
                                       tasksBuilder: TasksBuilder<A>,
                                       limit: number = 10): Promise<CalculatedTaskReps<A>> {

        Preconditions.assertPresent(mode, 'mode');

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

    /**
     * Return true if the user is actively using the flashcard/IR reviewer system.
     */
    public static async isReviewer(): Promise<boolean> {

        await FirestoreCollections.configure();

        const uid = await Firebase.currentUserID();

        if (!uid) {
            // they aren't logged into Firebase so clearly not...
            return false;
        }

        return await SpacedRepStats.hasStats(uid);

    }

}
