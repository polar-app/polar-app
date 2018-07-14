const {TraceEvent} = require("../../proxies/TraceEvent");


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
         * The page we're working with to which this annotation is attached.
         *
         * @type {HTMLElement}
         */
        this.pageElement = undefined;

        /**
         * The raw TraceEvent for this annotation.
         *
         * @type {TraceEvent}
         */
        this.traceEvent = undefined;

        Object.assign(this, opts);

        if(this.value) {
            this.id = this.value.id;
        } else {
            this.id = this.previousValue.id;
        }

    }

}

module.exports.AnnotationEvent = AnnotationEvent;
