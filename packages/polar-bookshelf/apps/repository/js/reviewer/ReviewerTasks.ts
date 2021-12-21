import {FirebaseBrowser} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {Task, TaskRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {SpacedRepStatCollection} from "polar-firebase/src/firebase/om/SpacedRepStatCollection";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";
import {IReadingTaskAction} from "./cards/ReadingTaskAction";
import {IFlashcardTaskAction} from "./cards/FlashcardTaskAction";

export const DEFAULT_READING_TASKS_LIMIT = 10;
export const DEFAULT_FLASHCARD_TASKS_LIMIT = 10;
export const DEFAULT_LIMIT = 10;

export type ITaskAction<T = unknown> = IReadingTaskAction<T> | IFlashcardTaskAction<T>;

export namespace TaskActionPredicates {
    export function isReadingTaskRep<T>(taskRep: TaskRep<ITaskAction<T>>): taskRep is TaskRep<IReadingTaskAction<T>> {
        return taskRep.action.type === 'reading';
    }

    export function isFlashcardTaskRep<T>(taskRep: TaskRep<ITaskAction<T>>): taskRep is TaskRep<IFlashcardTaskAction<T>> {
        return taskRep.action.type === 'flashcard';
    }
}

/**
 * Take tasks and then build a
 */
export interface TasksBuilder<A, B> {
    (data: ReadonlyArray<A>): ReadonlyArray<Task<B>>;
}

export class ReviewerTasks {

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
