import {SerializedObject} from './SerializedObject';
import {IPageInfo, PageInfo} from './PageInfo';
import {Flashcard, IFlashcard} from './Flashcard';
import {Comment, IComment} from './Comment';
import {INote, Note} from './Note';
import {ITextHighlight, TextHighlight} from './TextHighlight';
import {AreaHighlight, IAreaHighlight} from './AreaHighlight';
import {IScreenshot, Screenshot} from './Screenshot';
import {IThumbnail, Thumbnail} from './Thumbnail';
import {IPagemark, Pagemark} from './Pagemark';
import {IQuestion, Question} from './Question';
import {ReadingProgress} from './ReadingProgress';

export class PageMeta extends SerializedObject implements IPageMeta {

    public readonly pageInfo: IPageInfo;

    public readonly pagemarks: {[id: string]: IPagemark} = {};

    public readonly notes: {[id: string]: INote} = {};

    public readonly comments: {[id: string]: IComment} = {};

    public readonly questions: {[id: string]: IQuestion} = {};

    public readonly flashcards: {[id: string]: IFlashcard} = {};

    public readonly textHighlights: {[id: string]: ITextHighlight} = {};

    public readonly areaHighlights: {[id: string]: IAreaHighlight} = {};

    public readonly screenshots: {[id: string]: IScreenshot} = {};

    public readonly thumbnails: {[id: string]: IThumbnail} = {};

    public readonly readingProgress: {[id: string]: ReadingProgress} = {};

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

/**
 * A dedicated type for a page number.  From range [1,infinity)
 */
export type PageNumber = number;

export interface IPageMeta {

    /**
     * The pageInfo for this page.
     */
    readonly pageInfo: IPageInfo;

    /**
     * The index of page number to pagemark which stores the
     * data we need
     * for keeping track of pagemarks.  The index is the pagemark column.
     *
     */
    readonly pagemarks: {[id: string]: IPagemark};

    /**
     * The note for this annotation.
     */
    readonly notes: {[id: string]: INote};

    /**
     * The note for this annotation.
     */
    readonly comments: {[id: string]: IComment};

    /**
     *
     */
    readonly questions: {[id: string]: IQuestion};

    /**
     *
     */
    readonly flashcards: {[id: string]: IFlashcard};

    /**
     * An index of test highlights for the page.
     *
     */
    readonly textHighlights: {[id: string]: ITextHighlight};


    /**
     * An index of area highlights for the page.
     *
     */
    readonly areaHighlights: {[id: string]: IAreaHighlight};

    /**
     * Screenshots we've taken of this page while performing annotations.
     *
     * @Deprecated we're no longer using this and instead storing the
     * screenshots directly along with the image with a 'rel' and then storing
     * all the 'attachments' in the DocInfo.  The list of attachments is small
     * plus we need to have the DocInfo be a smaller structure for the
     * representation of the doc itself.
     */
    readonly screenshots: {[id: string]: IScreenshot};

    /**
     * The thumbnails for this page.  Usually, this is just one thumbnail
     * but there might be multiple.  If we want a specific noe we can just
     * look at the width and height.
     */
    readonly thumbnails: {[id: string]: IThumbnail};

    readonly readingProgress: {[id: string]: ReadingProgress};


}
