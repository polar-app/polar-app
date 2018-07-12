const {Hashcodes} = require("../Hashcodes");
const {Pagemark} = require("./Pagemark");
const {PagemarkType} = require("./PagemarkType");
const {PagemarkRect} = require("./PagemarkRect");
const {PagemarkRects} = require("./PagemarkRects");
const {ISODateTime} = require("./ISODateTime");
const {Objects} = require("../util/Objects");
const {round} = require("../util/Percentages");

const log = require("../logger/Logger").create();

const DEFAULT_PAGEMARK_RECT = new PagemarkRect({
    left: 0,
    top: 0,
    width: 100,
    height: 100
});

class Pagemarks {

    static createID(created) {

        let id = Hashcodes.create(JSON.stringify(created));

        // truncate.  We don't need that much precision against collision.
        return id.substring(0,10);

    }

    /**
     * Create a new pagemark with the created time, and other mandatory fields
     * added.
     *
     * @param options
     * @return {Pagemark}
     */
    static create(options = {}) {

        options = Objects.defaults( options, {

            // just set docMeta pageMarkType = PagemarkType.SINGLE_COLUMN by
            // default for now until we add multiple column types and handle
            // them properly.

            // TODO: this needs to be read from the docInfo setting for this
            // document and the default here

            /**
             * @type {Symbol}
             */
            type: PagemarkType.SINGLE_COLUMN,

            /**
             * @type {number}
             */
            column: 0,

        });

        let keyOptions= Pagemarks.createKeyOptions(options);

        if(keyOptions.count === 0) {
            throw new Error("Must specify either rect or percentage.");
        }

        if(keyOptions.count === 1) {

            if(keyOptions.hasPercentage) {
                keyOptions.rect = PagemarkRects.createFromPercentage(keyOptions.percentage);
            }

            if(keyOptions.hasRect) {
                keyOptions.percentage = keyOptions.rect.toPercentage();
            }

        }

        if(round(keyOptions.percentage) !== round(keyOptions.rect.toPercentage())) {
            let msg = "Percentage and rect are not the same";
            log.warn(msg, keyOptions.percentage, keyOptions.rect, keyOptions.rect.toPercentage());
            throw new Error(msg);
        }

        let created = new ISODateTime(new Date());

        return new Pagemark({

            // per-pagemark fields.
            id: Pagemarks.createID(created),
            created,

            // the rest are from options.
            type: options.type,
            percentage: keyOptions.percentage,
            column: options.column,
            rect: keyOptions.rect

        });

    }

    /**
     *
     * @param options
     * @return {KeyOptions}
     */
    static createKeyOptions(options) {

        let keyOptions = new KeyOptions();

        keyOptions.hasPercentage = "percentage" in options;
        keyOptions.hasRect = "rect" in options;

        if(keyOptions.hasPercentage)
            ++keyOptions.count;

        if(keyOptions.hasRect)
            ++keyOptions.count;

        keyOptions.rect = options.rect;
        keyOptions.percentage = options.percentage;

        return keyOptions;

    }

}

/**
 * The key / important options when creating a Pagemark.
 */
class KeyOptions {

    constructor() {

        /**
         * The total number of key options.
         *
         * @type {number}
         */
        this.count = 0;

        /**
         * True when we have the percentage.
         *
         * @type {boolean}
         */
        this.hasPercentage = undefined;

        /**
         * True when we have the rect.
         *
         * @type {boolean}
         */
        this.hasRect = undefined;

        /**
         * @type {PagemarkRect}
         */
        this.rect = undefined;

        /**
         * @type {number}
         */
        this.percentage = undefined;

    }

}

module.exports.Pagemarks = Pagemarks;
