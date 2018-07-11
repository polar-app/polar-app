/**
 * The box layout of this pagemark.  We use the typical DOM positioning style
 * of top, left, width and height only instead of percentages we represent
 * this as percentage of the entire 'page'.
 *
 * For example:
 *
 *
 * This would represent the range within a page that a pagemark covers.  This is
 * essentially a range has a start and end which are percentages of the page that
 * a pagemark covers but in two dimensions (not just one).
 *
 * A default pagemark (for the entire page) would have a value of:
 *
 * { top: 0, left: 0, width: 100, height: 100 }
 *
 * A range for a page that is half way completed is [0,50]
 *
 * { top: 0, left: 0, width: 100, height: 50 }
 *
 * We also provide additional functionality where we can start the pagemark
 * other than at the top of the page. For example, if you wanted to mark the
 * bottom 50% of the page as read, you could create the pagemark as:
 *
 * { top: 50, left: 0, width: 100, height: 50 }
 *
 * The user can create pagemarks at any point and then we create a small
 * pagemark anchored to that spot, and give it a bit of height so that the user
 * can visually see it.
 *
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
