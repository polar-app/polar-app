const {Hashcodes} = require("../Hashcodes");
const {Pagemark} = require("./Pagemark");
const {PagemarkType} = require("./PagemarkType");
const {ISODateTime} = require("./ISODateTime");
const {Objects} = require("../util/Objects");

class Pagemarks {

    static createID(created) {

        let id = Hashcodes.create(JSON.stringify(created));

        // truncate.  We don't need that much precision against collision.
        return id.substring(0,10);

    }

    static create(options) {

        options = Objects.defaults( options, {

            // just set docMeta pageMarkType = PagemarkType.SINGLE_COLUMN by
            // default for now until we add multiple column types and handle
            // them properly.

            type: PagemarkType.SINGLE_COLUMN,

            percentage: 100,

            column: 0

        });

        let created = new ISODateTime(new Date());
        return new Pagemark({
            id: Pagemarks.createID(created),
            created,
            type: options.type,
            percentage: options.percentage,
            column: options.column
        });

    }


}

module.exports.Pagemarks = Pagemarks;
