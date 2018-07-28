"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SchemaFactory {
    static create() {
        return {
            "title": "Flashcard",
            "description": "",
            "type": "object",
            "required": [
                "front",
                "back"
            ],
            "properties": {
                "front": {
                    "type": 'string',
                    "title": "Front"
                },
                "back": {
                    "type": "string",
                    "title": "Back"
                }
            }
        };
    }
}
exports.SchemaFactory = SchemaFactory;
module.exports.SchemaFactory = SchemaFactory;
//# sourceMappingURL=SchemaFactory.js.map