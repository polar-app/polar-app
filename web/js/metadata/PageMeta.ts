import {SerializedObject} from './SerializedObject';
import {PageInfo} from './PageInfo';
import {Flashcard} from './Flashcard';
import {Preconditions} from '../Preconditions';
import {TextHighlight} from './TextHighlight';
import {AreaHighlight} from './AreaHighlight';

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
    public pagemarks: {[id: string]: any} = {};

    /**
     * The note for this annotation.
     *
     */
    public readonly notes: {[id: string]: any} = {};

    /**
     *
     */
    public readonly questions: {[id: string]: any} = {};

    /**
     *
     * @type {Object<string,Flashcard>}
     */
    public readonly flashcards: {[id: string]: Flashcard} = {};

    /**
     * An index of test highlights for the page.
     *
     */
    public textHighlights: {[id: string]: TextHighlight} = {};


    /**
     * An index of area highlights for the page.
     *
     */
    public areaHighlights: {[id: string]: AreaHighlight} = {};

    /**
     * The thumbnails for this page.  Usually, this is just one thumbnail
     * but there might be multiple.  If we want a specific noe we can just
     * look at the width and height.
     *
     * @type {{}}
     */
    //this.thumbails = {};

    constructor(val: any) {

        super(val);

        this.pageInfo = val.pageInfo;

        this.init(val);

    }

    setup() {

        super.setup();

        if (!this.pagemarks) {
            // this could happen when serializing from old file formats
            this.pagemarks = {};
        }

        if (!this.textHighlights) {
            // this could happen when serializing from old file formats
            this.textHighlights = {};
        }

        if (!this.areaHighlights) {
            // this could happen when serializing from old file formats
            this.areaHighlights = {};
        }

    }

    validate() {

        super.validate();
        Preconditions.assertInstanceOf(this.pageInfo, PageInfo, "pageInfo");

    }

}
