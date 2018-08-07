export class SchemaFactory {

    static create(): any {

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
                // },
                // "age": {
                //     "type": "integer",
                //     "title": "Age"
                // },
                // "bio": {
                //     "type": "string",
                //     "title": "Bio"
                // },
                // "password": {
                //     "type": "string",
                //     "title": "Password",
                //     "minLength": 3
                // },
                // "telephone": {
                //     "type": "string",
                //     "title": "Telephone",
                //     "minLength": 10
                // }
            }

        };

    }

}

module.exports.SchemaFactory = SchemaFactory;
