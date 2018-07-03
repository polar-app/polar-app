/**
 *
 */
class RectText {

    constructor(obj) {

        /**
         *
         * @type {Rect}
         */
        this.clientRects = undefined;

        /**
         *
         * @type {Rect}
         */
        this.boundingClientRect = undefined;

        /**
         *
         * @type {Rect}
         */
        this.boundingPageRect = undefined;

        /**
         *
         * @type {String}
         */
        this.text = undefined;

        Object.assign(this, obj);

    }

}

module.exports.RectText = RectText;
