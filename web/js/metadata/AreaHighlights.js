const {Hashcodes} = require("../Hashcodes");
const {AreaHighlight} = require("./AreaHighlight");
const {ISODateTime} = require("./ISODateTime");
const {Preconditions} = require("../Preconditions");

class AreaHighlights {

    static createID(created) {
        return Hashcodes.createID(created);
    }

    /**
     * Create a new pagemark with the created time, and other mandatory fields
     * added.
     *
     * @param opts
     * @return {AreaHighlight}
     */
    static create(opts = {}) {

        Preconditions.assertNotNull(opts.rect, "rect");

        let created = new ISODateTime(new Date());

        return new AreaHighlight({

            // per-pagemark fields.
            id: AreaHighlights.createID(created),

            created,

            // there is only one rect for an area highlight.
            rects: { "0": opts.rect }

        });

    }

}

module.exports.AreaHighlights = AreaHighlights;
