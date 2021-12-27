import {TaskRep} from "polar-spaced-repetition-api/src/scheduler/S2Plus/S2Plus";
import {IReadingTaskAction} from "./cards/ReadingTaskAction";
import {IFlashcardTaskAction} from "./cards/FlashcardTaskAction";
import {ITaskAction} from "./ITaskAction";

export namespace TaskActionPredicates {
    export function isReadingTaskRep<T>(taskRep: TaskRep<ITaskAction<T>>): taskRep is TaskRep<IReadingTaskAction<T>> {
        return taskRep.action.type === 'reading';
    }

    export function isFlashcardTaskRep<T>(taskRep: TaskRep<ITaskAction<T>>): taskRep is TaskRep<IFlashcardTaskAction<T>> {
        return taskRep.action.type === 'flashcard';
    }
}
