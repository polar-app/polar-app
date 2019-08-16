import {Annotation, IAnnotation} from './Annotation';
import {Note} from './Note';
import {PagemarkType} from './PagemarkType';
import {PagemarkRect} from './PagemarkRect';
import {MetadataSerializer} from './MetadataSerializer';
import {PagemarkMode} from './PagemarkMode';

export class Pagemark extends Annotation implements IPagemark {

    // TODO: should pagemarks support the full nesting model where we can
    // have comments, notes, flashcards, etc?  Probably not but notes might
    // make sense.

    public notes: {[id: string]: Note};

    public type: PagemarkType;

    public percentage: number;

    public column: number;

    public rect: PagemarkRect;

    public mode: PagemarkMode;

    public batch?: string;

    // TODO: add an 'inactive' field so that the user can toggle the pagemarks
    // active and inactive easily.

    constructor(val: any) {

        super(val);

        // TODO: should pagemarks support the full nesting model where we can
        // have comments, notes, flashcards, etc?  Probably not but notes might
        // make sense.

        this.notes = val.notes;
        this.type = val.type;
        this.percentage = val.percentage;
        this.column = val.percentage;
        this.rect = val.rect;
        this.mode = val.mode;

        // TODO: support 'range' in the future which is a PagemarkRange so that
        // we can start off reading within a smaller page.

        this.init(val);

    }

    public setup() {

        super.setup();

        if (!this.notes) {
            this.notes = {};
        }

        if (!this.type) {
            this.type = PagemarkType.SINGLE_COLUMN;
        }

        if (!this.mode) {
            this.mode = PagemarkMode.READ;
        }

        if (!this.percentage) {
            this.percentage = 100;
        }

        if (!this.column) {
            this.column = 0;
        }

    }

    public validate() {
        super.validate();
    }

    public toString() {
        return MetadataSerializer.serialize(this);
    }

}

export interface PagemarkRef {

    readonly pageNum: number;

    readonly pagemark: IPagemark;

}

export interface PagemarkIDRef {

    readonly pageNum: number;

    readonly id: string;

}

export interface IPagemark extends IAnnotation {

    /**
     * The note for this annotation.
     */
    notes: {[id: string]: Note};

    /**
     * The type of pagemark.
     *
     */
    type: PagemarkType;

    /**
     * The total percentage of the page that is covered with the page mark.
     * From 0 to 100.  This factors in the total rows and columns on the
     * page and is the raw percentage value of the page.
     *
     */
    percentage: number;

    /**
     * The column number on which this pagemark is rendered.  This is mostly
     * metadata and we should be migrating to PagemarkRect and PagemarkRange
     * which supports raw rendering of the pagemarks.
     */
    column: number;

    /**
     * The PagemarkRect for this pagemark. When not specified we use a box of
     *
     * { top: 0, left: 0, width: 100, height: 100 }
     *
     * or the whole page.
     *
     */
    rect: PagemarkRect;

    /**
     * The mode of this pagemark (read, ignored, etc).
     */
    mode: PagemarkMode;

    /**
     * A batch is used when creating multiple pagemarks over multiple pages.
     *
     * We can then change settings on the entire, batch at once.  The batch
     * is created with one unique operation across several pages.
     *
     */
    batch?: string;

}
