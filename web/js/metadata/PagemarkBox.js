/**
 * TODO: refactor this as top, left and width height and do this as percentages
 * of the entire page.
 *
 */
module.exports.PagemarkBox = class {

    constructor(start, end) {

        /**
         * The row range that this pagemark represents.
         *
         * @type {PagemarkRange}
         */
        this.rows = null;

        /**
         * The column range that this pagemark represents.
         *
         * @type {PagemarkRange}
         */
        this.columns = null;

    }

};
