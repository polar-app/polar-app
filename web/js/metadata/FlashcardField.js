"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardField = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Objects_1 = require("polar-shared/src/util/Objects");
class FlashcardField {
    constructor(opts) {
        opts = Objects_1.Objects.defaults(opts, {
            description: "",
            rememberLastInput: false,
            required: false
        });
        this.name = Preconditions_1.Preconditions.assertNotNull(opts.name, "name");
        this.type = Preconditions_1.Preconditions.assertNotNull(opts.type, "type");
        this.description = opts.description;
        this.rememberLastInput = opts.rememberLastInput;
        this.required = opts.required;
    }
}
exports.FlashcardField = FlashcardField;
;
//# sourceMappingURL=FlashcardField.js.map