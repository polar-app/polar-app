"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flashcard = void 0;
const VersionedObject_1 = require("./VersionedObject");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class Flashcard extends VersionedObject_1.VersionedObject {
    constructor(template) {
        super(template);
        this.type = template.type;
        this.fields = template.fields;
        this.archetype = template.archetype;
        this.guid = template.guid;
        this.init(template);
    }
    validate() {
        super.validate();
        Preconditions_1.Preconditions.assertPresent(this.id, "id");
        Preconditions_1.Preconditions.assertPresent(this.type, "type");
        Preconditions_1.Preconditions.assertPresent(this.guid, "guid");
        Preconditions_1.Preconditions.assertPresent(this.fields, "fields");
        Preconditions_1.Preconditions.assertPresent(this.archetype, "archetype");
    }
    static newInstance(id, guid, created, lastUpdated, type, fields, archetype, ref) {
        const result = new Flashcard({
            id, guid, created, lastUpdated, type, fields, archetype, ref
        });
        return Object.freeze(result);
    }
}
exports.Flashcard = Flashcard;
//# sourceMappingURL=Flashcard.js.map