"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Annotation_1 = require("./Annotation");
const PagemarkType_1 = require("./PagemarkType");
const MetadataSerializer_1 = require("./MetadataSerializer");
const PagemarkMode_1 = require("./PagemarkMode");
class Pagemark extends Annotation_1.Annotation {
    constructor(val) {
        super(val);
        this.notes = val.notes;
        this.type = val.type;
        this.percentage = val.percentage;
        this.column = val.percentage;
        this.rect = val.rect;
        this.mode = val.mode;
        this.init(val);
    }
    setup() {
        super.setup();
        if (!this.notes) {
            this.notes = {};
        }
        if (!this.type) {
            this.type = PagemarkType_1.PagemarkType.SINGLE_COLUMN;
        }
        if (!this.mode) {
            this.mode = PagemarkMode_1.PagemarkMode.READ;
        }
        if (!this.percentage) {
            this.percentage = 100;
        }
        if (!this.column) {
            this.column = 0;
        }
    }
    validate() {
        super.validate();
    }
    toString() {
        return MetadataSerializer_1.MetadataSerializer.serialize(this);
    }
}
exports.Pagemark = Pagemark;
//# sourceMappingURL=Pagemark.js.map