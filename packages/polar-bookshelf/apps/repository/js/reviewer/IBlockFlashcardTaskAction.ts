import {IFlashcardTaskAction} from "./cards/FlashcardTaskAction";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {IFlashcardAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";

export type IBlockFlashcardTaskAction = IFlashcardTaskAction<IBlock<IFlashcardAnnotationContent>>;
