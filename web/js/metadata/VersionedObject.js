"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionedObject = void 0;
const SerializedObject_1 = require("./SerializedObject");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class VersionedObject extends SerializedObject_1.SerializedObject {
    constructor(template) {
        super(template);
        this.id = template.id;
        this.guid = template.guid;
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
        this.created = Preconditions_1.Preconditions.assertPresent(this.created);
        this.lastUpdated = Preconditions_1.Preconditions.assertPresent(this.lastUpdated);
        Preconditions_1.Preconditions.assertNotNull(this.id, "id");
        Preconditions_1.Preconditions.assertNotNull(this.created, "created");
    }
}
exports.VersionedObject = VersionedObject;
//# sourceMappingURL=VersionedObject.js.map