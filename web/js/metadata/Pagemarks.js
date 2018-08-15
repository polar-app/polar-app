"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ISODateTime_1 = require("./ISODateTime");
const PagemarkRect_1 = require("./PagemarkRect");
const Pagemark_1 = require("./Pagemark");
const Logger_1 = require("../logger/Logger");
const Hashcodes_1 = require("../Hashcodes");
const Objects_1 = require("../util/Objects");
const PagemarkType_1 = require("./PagemarkType");
const PagemarkRects_1 = require("./PagemarkRects");
const Dictionaries_1 = require("../util/Dictionaries");
const Percentages_1 = require("../util/Percentages");
const PagemarkMode_1 = require("./PagemarkMode");
const log = Logger_1.Logger.create();
const DEFAULT_PAGEMARK_RECT = new PagemarkRect_1.PagemarkRect({
    left: 0,
    top: 0,
    width: 100,
    height: 100
});
class Pagemarks {
    static createID(created) {
        let id = Hashcodes_1.Hashcodes.create(JSON.stringify(created));
        return id.substring(0, 10);
    }
    static create(options = {}) {
        options = Objects_1.Objects.defaults(options, {
            type: PagemarkType_1.PagemarkType.SINGLE_COLUMN,
            column: 0,
        });
        let keyOptions = Pagemarks.createKeyOptions(options);
        if (keyOptions.count === 0) {
            throw new Error("Must specify either rect or percentage.");
        }
        if (keyOptions.count === 1) {
            if (keyOptions.hasPercentage) {
                keyOptions.rect = PagemarkRects_1.PagemarkRects.createFromPercentage(keyOptions.percentage);
            }
            if (keyOptions.hasRect) {
                keyOptions.percentage = keyOptions.rect.toPercentage();
            }
        }
        if (Percentages_1.round(keyOptions.percentage) !== Percentages_1.round(keyOptions.rect.toPercentage())) {
            let msg = "Percentage and rect are not the same";
            log.warn(msg, keyOptions.percentage, keyOptions.rect, keyOptions.rect.toPercentage());
            throw new Error(msg);
        }
        let created = new ISODateTime_1.ISODateTime(new Date());
        return new Pagemark_1.Pagemark({
            id: Pagemarks.createID(created),
            created,
            type: options.type,
            percentage: keyOptions.percentage,
            column: options.column,
            rect: keyOptions.rect
        });
    }
    static createKeyOptions(options) {
        let keyOptions = {
            count: 0,
            hasPercentage: false,
            hasRect: false,
            rect: options.rect,
            percentage: options.percentage
        };
        keyOptions.hasPercentage = "percentage" in options;
        keyOptions.hasRect = "rect" in options;
        if (keyOptions.hasPercentage)
            ++keyOptions.count;
        if (keyOptions.hasRect)
            ++keyOptions.count;
        return keyOptions;
    }
    static upgrade(pagemarks) {
        let result = {};
        Object.assign(result, pagemarks);
        Dictionaries_1.Dictionaries.forDict(result, (key, pagemark) => {
            if (!pagemark.rect) {
                if (pagemark.percentage >= 0 && pagemark.percentage <= 100) {
                    pagemark.rect = PagemarkRects_1.PagemarkRects.createFromPercentage(pagemark.percentage);
                }
            }
            if (!pagemark.id) {
                log.warn("Pagemark given ID");
                pagemark.id = Pagemarks.createID(pagemark.created);
            }
            if (!pagemark.mode) {
                pagemark.mode = PagemarkMode_1.PagemarkMode.READ;
            }
        });
        return result;
    }
}
exports.Pagemarks = Pagemarks;
//# sourceMappingURL=Pagemarks.js.map