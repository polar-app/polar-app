"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VersionedObject_1 = require("./VersionedObject");
class Flashcard extends VersionedObject_1.VersionedObject {
    constructor(template) {
        super(template);
        this.id = template.id;
        this.created = template.created;
        this.lastUpdated = template.lastUpdated;
        this.type = template.type;
        this.fields = template.fields;
        this.archetype = template.archetype;
        this.init(template);
    }
    validate() {
        super.validate();
    }
    static newInstance(id, created, lastUpdated, type, fields, archetype) {
        let result = Object.create(Flashcard.prototype);
        Object.assign(result, {
            id, created, lastUpdated, type, fields, archetype
        });
        result.init();
        return Object.freeze(result);
    }
}
exports.Flashcard = Flashcard;
//# sourceMappingURL=Flashcard.js.map