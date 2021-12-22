import {IBlockReadingTaskAction} from "./IBlockReadingTaskAction";
import {IBlockFlashcardTaskAction} from "./IBlockFlashcardTaskAction";

export type IBlockTaskAction = IBlockReadingTaskAction | IBlockFlashcardTaskAction;
