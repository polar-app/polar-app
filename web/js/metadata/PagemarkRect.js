/**
 * The box layout of this pagemark.  We use the typical DOM positioning style
 * of top, left, width and height only instead of percentages we represent
 * this as percentage of the entire 'page'.
 *
 * For example:
 *
 * { top: 0, left: 0, width: 100, height: 100 }
 *
 */
class PagemarkRect {

    constructor(obj) {

        /**
         * @type {number}
         */
        this.top = undefined;

        /**
         * @type {number}
         */
        this.left = undefined;

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

};

module.exports.PagemarkRect = PagemarkRect;
