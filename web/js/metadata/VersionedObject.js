"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ISODateTime_1 = require("./ISODateTime");
const SerializedObject_1 = require("./SerializedObject");
const Preconditions_1 = require("../Preconditions");
class VersionedObject extends SerializedObject_1.SerializedObject {
    constructor(template) {
        super(template);
        this.id = template.id;
        this.created = template.created;
        this.lastUpdated = template.lastUpdated;
        this.author = template.author;
        this.init(template);
    }
    setup() {
        super.setup();
        if (!this.lastUpdated && this.created) {
            this.lastUpdated = this.created;
        }
    }
    validate() {
        super.validate();
        Preconditions_1.Preconditions.assertNotNull(this.id, "id");
        Preconditions_1.Preconditions.assertNotNull(this.created, "created");
        Preconditions_1.Preconditions.assertInstanceOf(this.created, ISODateTime_1.ISODateTime, "created");
        Preconditions_1.Preconditions.assertInstanceOf(this.lastUpdated, ISODateTime_1.ISODateTime, "lastUpdated");
    }
}
exports.VersionedObject = VersionedObject;
//# sourceMappingURL=VersionedObject.js.map