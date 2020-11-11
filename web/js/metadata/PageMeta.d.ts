import { SerializedObject } from './SerializedObject';
import { ReadingProgress } from 'polar-shared/src/metadata/ReadingProgress';
import { IPageMeta } from "polar-shared/src/metadata/IPageMeta";
import { IPageInfo } from "polar-shared/src/metadata/IPageInfo";
import { IPagemark } from "polar-shared/src/metadata/IPagemark";
import { INote } from "polar-shared/src/metadata/INote";
import { IComment } from "polar-shared/src/metadata/IComment";
import { IQuestion } from "polar-shared/src/metadata/IQuestion";
import { IFlashcard } from "polar-shared/src/metadata/IFlashcard";
import { ITextHighlight } from "polar-shared/src/metadata/ITextHighlight";
import { IAreaHighlight } from "polar-shared/src/metadata/IAreaHighlight";
import { IScreenshot } from "polar-shared/src/metadata/IScreenshot";
import { IThumbnail } from "polar-shared/src/metadata/IThumbnail";
export declare class PageMeta extends SerializedObject implements IPageMeta {
    readonly pageInfo: IPageInfo;
    readonly pagemarks: {
        [id: string]: IPagemark;
    };
    readonly notes: {
        [id: string]: INote;
    };
    readonly comments: {
        [id: string]: IComment;
    };
    readonly questions: {
        [id: string]: IQuestion;
    };
    readonly flashcards: {
        [id: string]: IFlashcard;
    };
    readonly textHighlights: {
        [id: string]: ITextHighlight;
    };
    readonly areaHighlights: {
        [id: string]: IAreaHighlight;
    };
    readonly screenshots: {
        [id: string]: IScreenshot;
    };
    readonly thumbnails: {
        [id: string]: IThumbnail;
    };
    readonly readingProgress: {
        [id: string]: ReadingProgress;
    };
    constructor(val: any);
    setup(): void;
    validate(): void;
}
