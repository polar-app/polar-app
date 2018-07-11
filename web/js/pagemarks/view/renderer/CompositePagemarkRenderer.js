const {Delegator} = require("../../../utils.js");
const {PagemarkRenderer} = require("./PagemarkRenderer");

class CompositePagemarkRenderer extends PagemarkRenderer {

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

};

module.exports.CompositePagemarkRenderer = CompositePagemarkRenderer;
