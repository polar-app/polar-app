import {
    CalculatedTaskReps,
    createDefaultTaskRepResolver,
    OptionalTaskRepResolver,
    TasksCalculator
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator";
import {SpacedRepCollection} from "polar-firebase/src/firebase/om/SpacedRepCollection";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {RepetitionMode, Task, TaskRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {Preconditions} from "polar-shared/src/Preconditions";
import {SpacedRepStatCollection} from "polar-firebase/src/firebase/om/SpacedRepStatCollection";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import {DocAnnotationTaskAction} from "./DocAnnotationReviewerTasks";

export const DEFAULT_READING_TASKS_LIMIT = 10;
export const DEFAULT_FLASHCARD_TASKS_LIMIT = 10;

export type TaskAction = DocAnnotationTaskAction;

/**
 * Take tasks and then build a
 */
export interface TasksBuilder<A, B> {
    (repoDocAnnotations: ReadonlyArray<A>): ReadonlyArray<Task<B>>;
}

export class ReviewerTasks {

    public static async createTasks<A, B>(data: ReadonlyArray<A>,
                                          mode: RepetitionMode,
                                          tasksBuilder: TasksBuilder<A, B>,
                                          limit: number = 10): Promise<CalculatedTaskReps<B>> {

        Preconditions.assertPresent(mode, 'mode');

        // TODO: we also need to be able to review images.... we also need a dedicated provider to
        // return the right type of annotation type...

        const potential: ReadonlyArray<Task<B>> = tasksBuilder(data);
        const uid = await FirebaseBrowser.currentUserID();
        const firestore = await FirestoreBrowserClient.getInstance();

        if (! uid) {
            throw new Error("Not authenticated");
        }

        const spacedReps = await SpacedRepCollection.list(firestore, uid);

        const spacedRepsMap = IDMaps.create(spacedReps);

        const optionalTaskRepResolver: OptionalTaskRepResolver<B>
            = async (task: Task<B>): Promise<TaskRep<B> | undefined> => {

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

        const uid = await FirebaseBrowser.currentUserID();
        const firestore = await FirestoreBrowserClient.getInstance();


        if (!uid) {
            // they aren't logged into Firebase so clearly not...
            return false;
        }

        return await SpacedRepStatCollection.hasStats(firestore, uid);

    }

}
