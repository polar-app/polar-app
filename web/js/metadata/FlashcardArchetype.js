"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardArchetype = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Objects_1 = require("polar-shared/src/util/Objects");
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