const{Preconditions} = require("../Preconditions");

/**
 * Represents a reference to an annotation which includes all the information
 * we need to work with the annotation.
 */
class AnnotationReference {

    constructor(opts) {

        /**
         * The page number on which the annotation is placed.
         *
         * @type {number}
         */
        this.pageNum = undefined;

        /**
         * The ID for the annotation.
         *
         * @type {string}
         */
        this.id = undefined;

        Object.assign(this, opts);

        Preconditions.assertNotNull(this.pageNum, "pageNum");
        Preconditions.assertNotNull(this.id, "id");

    }

}

module.exports.AnnotationPointer = AnnotationReference;
