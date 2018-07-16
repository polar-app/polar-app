const {SerializedObject} = require("./SerializedObject.js");
const {PageInfo} = require("./PageInfo");

class PageMeta extends SerializedObject {

    constructor(val) {

        super(val);

        /**
         * The pageInfo for this page.
         */
        this.pageInfo = null;

        /**
         * The index of page number to pagemark which stores the data we need
         * for keeping track of pagemarks.  The index is the pagemark column.
         *
         * @type Object<string,pagemark>
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
         * @type map<string,Question>
         */
        this.questions = {};

        /**
         *
         * @type map<string,Flashcard>
         */
        this.flashcards = {};

        /**
         * An index of test highlights for the page.
         *
         * @type map<string,TextHighlight>
         */
        this.textHighlights = {};

        /**
         * An index of area highlights for the page.
         *
         * @type map<string,AreaHighlight>
         */
        this.areaHighlights = {};

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

        this.validateMembers([
            {name: 'pageInfo', instance: PageInfo}
        ]);

    }

}

module.exports.PageMeta = PageMeta;
