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
class PagemarkBox {

    constructor(obj) {

        /**
         * The
         * @type {null}
         */
        this.top = null;

        this.left = null;

        this.width = null;

        this.height = null;

        Object.assign(this, obj);

    }

};

module.exports.PagemarkBox = PagemarkBox;
