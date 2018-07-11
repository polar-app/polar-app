const {Text} = require("./Text.js");

class Texts {

    static create(body, type) {

        // TODO: if this is markdown, and we don't have the HTML version,
        // we need to add the HTML version by converting the markdown to HTML.

        let result = {};
        result[type] = body;
        return result;

    }

};

module.exports.Texts = Texts;
