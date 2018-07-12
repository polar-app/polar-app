const {PagemarkType} = require("./PagemarkType");
const {PagemarkRect} = require("./PagemarkRect");

class PagemarkRects {

    /**
     *
     * Create a default PagemarkRect from a Pagemark that might be legacy.
     *
     * @param pagemark {Pagemark}
     * @return {PagemarkRect}
     */
    static createDefault(pagemark) {

        if(pagemark.type === PagemarkType.SINGLE_COLUMN && "percentage" in pagemark) {

            return new PagemarkRect({
                left: 0,
                top: 0,
                width: 100,
                height: pagemark.percentage
            });

        }

        throw new Error("Can not create default");

    }

    static createFromPercentage(percentage) {

        return new PagemarkRect({
            left: 0,
            top: 0,
            width: 100,
            height: percentage
        });
    }

}

module.exports.PagemarkRects = PagemarkRects;
