import {SerializedObject} from './SerializedObject';
import {PageInfo} from './PageInfo';
import {Flashcard} from './Flashcard';
import {Comment} from './Comment';
import {Note} from './Note';
import {TextHighlight} from './TextHighlight';
import {AreaHighlight} from './AreaHighlight';
import {Screenshot} from './Screenshot';
import {Thumbnail} from './Thumbnail';
import {Pagemark} from './Pagemark';
import {Question} from './Question';
import {ReadingProgress} from './ReadingProgress';

export class PageMeta extends SerializedObject {

    /**
     * The pageInfo for this page.
     * @type {PageInfo}
     */
    public readonly pageInfo: PageInfo;

    /**
     * The index of page number to pagemark which stores the data we need
     * for keeping track of pagemarks.  The index is the pagemark column.
     *
     */
    public readonly pagemarks: {[id: string]: Pagemark} = {};

    /**
     * The note for this annotation.
     */
    public readonly notes: {[id: string]: Note} = {};

    /**
     * The note for this annotation.
     */
    public readonly comments: {[id: string]: Comment} = {};

    /**
     *
     */
    public readonly questions: {[id: string]: Question} = {};

    /**
     *
     * @type {Object<string,Flashcard>}
     */
    public readonly flashcards: {[id: string]: Flashcard} = {};

    /**
     * An index of test highlights for the page.
     *
     */
    public readonly textHighlights: {[id: string]: TextHighlight} = {};


    /**
     * An index of area highlights for the page.
     *
     */
    public readonly areaHighlights: {[id: string]: AreaHighlight} = {};

    /**
     * Screenshots we've taken of this page while performing annotations.
     */
    public readonly screenshots: {[id: string]: Screenshot} = {};

    /**
     * The thumbnails for this page.  Usually, this is just one thumbnail
     * but there might be multiple.  If we want a specific noe we can just
     * look at the width and height.
     */
    public readonly thumbnails: {[id: string]: Thumbnail} = {};

    public readonly readingProgress?: ReadingProgress;

    public readonly readingProgressLog: {[id: string]: ReadingProgress} = {};

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

