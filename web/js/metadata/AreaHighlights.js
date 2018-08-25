"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hashcodes_1 = require("../Hashcodes");
const Preconditions_1 = require("../Preconditions");
const ISODateTime_1 = require("./ISODateTime");
const AreaHighlight_1 = require("./AreaHighlight");
class AreaHighlights {
    static createID(created) {
        return Hashcodes_1.Hashcodes.createID(created);
    }
    static create(opts = {}) {
        Preconditions_1.Preconditions.assertNotNull(opts.rect, "rect");
        let created = new ISODateTime_1.ISODateTime(new Date());
        return new AreaHighlight_1.AreaHighlight({
            id: AreaHighlights.createID(created),
            created,
            rects: { "0": opts.rect }
        });
    }
}
//# sourceMappingURL=AreaHighlights.js.map