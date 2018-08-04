const {Preconditions} = require("../Preconditions");
const {SerializedObject} = require("./SerializedObject.js");
const {PageInfo} = require("./PageInfo");

class PageMeta extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The pageInfo for this page.
         * @type {PageInfo}
         */
        this.pageInfo = null;

        /**
         * The index of page number to pagemark which stores the data we need
         * for keeping track of pagemarks.  The index is the pagemark column.
         *
         * @type {Object<string,pagemark>}
         */
        this.pagemarks = {};

        /**
         * The note for this annotation.
         *
         * @type Object<string,Note>
         */
        this.notes = {};

        /**
         *
         * @type {Object<string,Question>}
         */
        this.questions = {};

        /**
         *
         * @type {Object<string,Flashcard>}
         */
        this.flashcards = {};

        /**
         * An index of test highlights for the page.
         *
         * @type {Object<string,TextHighlight>}
         */
        this.textHighlights = {};

        /**
         * An index of area highlights for the page.
         *
         * @type {Object<string,AreaHighlight>}
         */
        this.areaHighlights = {};

        /**
         * The thumbnails for this page.  Usually, this is just one thumbnail
         * but there might be multiple.  If we want a specific noe we can just
         * look at the width and height.
         *
         * @type {{}}
         */
        //this.thumbails = {};

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

module.exports.PageMeta = PageMeta;
