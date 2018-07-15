const {AbstractPagemarkComponent} = require("./AbstractPagemarkComponent");

/**
 * The primary pagemark for displaying pagemarks on a .page.  This is in contrast
 * to a thumbnail pagemark.
 */

class PrimaryPagemarkComponent extends AbstractPagemarkComponent {

    constructor() {
        super("primary");
    }

}

module.exports.PrimaryPagemarkComponent = PrimaryPagemarkComponent;
