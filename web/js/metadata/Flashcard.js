"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VersionedObject_1 = require("./VersionedObject");
const Preconditions_1 = require("../Preconditions");
class Flashcard extends VersionedObject_1.VersionedObject {
    constructor(template) {
        super(template);
        this.type = template.type;
        this.fields = template.fields;
        this.archetype = template.archetype;
        this.init(template);
    }
    validate() {
        super.validate();
        Preconditions_1.Preconditions.assertNotNull(this.type, "type");
        Preconditions_1.Preconditions.assertNotNull(this.fields, "fields");
        Preconditions_1.Preconditions.assertNotNull(this.archetype, "archetype");
    }
    static newInstance(id, created, lastUpdated, type, fields, archetype) {
        let result = new Flashcard({
            id, created, lastUpdated, type, fields, archetype
        });
        return Object.freeze(result);
    }
}
exports.Flashcard = Flashcard;
//# sourceMappingURL=Flashcard.js.map