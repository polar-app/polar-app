import {IReadingTaskAction} from "./cards/ReadingTaskAction";
import {IFlashcardTaskAction} from "./cards/FlashcardTaskAction";

export type ITaskAction<T = unknown> = IReadingTaskAction<T> | IFlashcardTaskAction<T>;
