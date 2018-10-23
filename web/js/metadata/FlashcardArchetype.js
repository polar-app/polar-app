"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Objects_1 = require("../util/Objects");
const Preconditions_1 = require("../Preconditions");
class FlashcardArchetype {
    constructor(opts) {
        opts = Objects_1.Objects.defaults(opts, {
            description: "",
        });
        this.id = Preconditions_1.Preconditions.assertNotNull(opts.id, "id");
        this.name = Preconditions_1.Preconditions.assertNotNull(opts.name, "name");
        this.description = opts.description;
        this.fields = opts.fields;
    }
}
exports.FlashcardArchetype = FlashcardArchetype;
//# sourceMappingURL=FlashcardArchetype.js.map