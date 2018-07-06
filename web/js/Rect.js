/**
 * Basic DOM style rect without a hard requirement to use a DOMRect.
 */
class Rect {

    constructor(obj) {

        /**
         * @type {number}
         */
        this.left = undefined;

        /**
         * @type {number}
         */
        this.top = undefined;

        /**
         * @type {number}
         */
        this.right = undefined;

        /**
         * @type {number}
         */
        this.bottom = undefined;

        /**
         * @type {number}
         */
        this.width = undefined;

        /**
         * @type {number}
         */
        this.height = undefined;

        Object.assign(this, obj);

    }

}

module.exports.Rect = Rect;
