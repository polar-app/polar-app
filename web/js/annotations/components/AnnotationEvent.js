const {TraceEvent} = require("../../proxies/TraceEvent");
const {DocFormatFactory} = require("../../docformat/DocFormatFactory");
const {Preconditions} = require("../../Preconditions");


class AnnotationEvent extends TraceEvent {

    constructor(opts) {

        super(opts);

        /**
         * The ID for this annotation.
         *
         * @type {string}
         */
        this.id = undefined;

        /**
         *
         * @type {DocMeta}
         */
        this.docMeta = undefined;

        /**
         *
         * @type {PageMeta}
         */
        this.pageMeta = undefined;

        /**
         * The page we're working with.
         *
         * @type {number}
         */
        this.pageNum = undefined;

        /**
         * The raw TraceEvent for this annotation.
         *
         * @type {TraceEvent}
         */
        this.traceEvent = undefined;

        /**
         * The container which holds this annotation.
         *
         * @type {HTMLElement}
         */
        this.container = undefined;

        Object.assign(this, opts);

        if(this.value) {
            this.id = this.value.id;
        } else {
            this.id = this.previousValue.id;
        }

        Preconditions.assertNotNull(this.pageMeta, "pageMeta");

    }

}

module.exports.AnnotationEvent = AnnotationEvent;
