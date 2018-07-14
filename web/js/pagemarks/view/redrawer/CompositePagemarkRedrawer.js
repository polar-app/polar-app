const {Delegator} = require("../../../utils.js");
const {PagemarkRedrawer} = require("./PagemarkRedrawer");

/**
 * @Deprecated Remove when we go to the new PagemarkView system
 */
class CompositePagemarkRedrawer extends PagemarkRedrawer {

    constructor(view, delegates) {
        super(view);

        if(!delegates) {
            throw new Error("No delegates");
        }

        this.delegator = new Delegator(delegates);
    }

    setup() {
        this.delegator.apply("setup");
    }

    create(pageNum, pagemark) {
        this.delegator.apply("create", pageNum, pagemark);
    }

    erase(pageNum) {
        this.delegator.apply("erase", pageNum);
    }

}

module.exports.CompositePagemarkRedrawer = CompositePagemarkRedrawer;
