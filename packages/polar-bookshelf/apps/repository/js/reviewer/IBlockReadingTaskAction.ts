import {IReadingTaskAction} from "./cards/ReadingTaskAction";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {IAnnotationHighlightContent} from "polar-blocks/src/blocks/content/IAnnotationContent";

export type IBlockReadingTaskAction = IReadingTaskAction<IBlock<IAnnotationHighlightContent>>;
