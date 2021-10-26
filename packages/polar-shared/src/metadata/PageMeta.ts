import {SerializedObject} from "./SerializedObject";
import {ReadingProgress} from './ReadingProgress';
import {IPageMeta} from "./IPageMeta";
import {IPageInfo} from "./IPageInfo";
import {IPagemark} from "./IPagemark";
import {INote} from "./INote";
import {IComment} from "./IComment";
import {IQuestion} from "./IQuestion";
import {IFlashcard} from "./IFlashcard";
import {ITextHighlight} from "./ITextHighlight";
import {IAreaHighlight} from "./IAreaHighlight";
import {IScreenshot} from "./IScreenshot";
import {IThumbnail} from "./IThumbnail";

export class PageMeta extends SerializedObject implements IPageMeta {

    public readonly pageInfo: IPageInfo;

    public readonly pagemarks: {readonly [id: string]: IPagemark} = {};

    public readonly notes: {readonly [id: string]: INote} = {};

    public readonly comments: {readonly [id: string]: IComment} = {};

    public readonly questions: {readonly [id: string]: IQuestion} = {};

    public readonly flashcards: {readonly [id: string]: IFlashcard} = {};

    public readonly textHighlights: {readonly [id: string]: ITextHighlight} = {};

    public readonly areaHighlights: {readonly [id: string]: IAreaHighlight} = {};

    public readonly screenshots: {readonly [id: string]: IScreenshot} = {};

    public readonly thumbnails: {readonly [id: string]: IThumbnail} = {};

    public readonly readingProgress: {readonly [id: string]: ReadingProgress} = {};

    constructor(val: any) {

        super(val);

        this.pageInfo = val.pageInfo;

        this.init(val);

    }

    public setup() {

        super.setup();

        if (!this.pagemarks) {
            // this could happen when serializing from old file formats
            (<any> this).pagemarks = {};
        }

        if (!this.textHighlights) {
            // this could happen when serializing from old file formats
            (<any> this).textHighlights = {};
        }

        if (!this.areaHighlights) {
            // this could happen when serializing from old file formats
            (<any> this).areaHighlights = {};
        }

        if (!this.screenshots) {
            // this could happen when serializing from old file formats
            (<any> this).screenshots = {};
        }

        if (!this.thumbnails) {
            // this could happen when serializing from old file formats
            (<any> this).thumbnails = {};
        }

    }

    public validate() {

        super.validate();
        // Preconditions.assertInstanceOf(this.pageInfo, PageInfo, "pageInfo");

    }

}

