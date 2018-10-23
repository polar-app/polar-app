"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
const Objects_1 = require("../util/Objects");
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