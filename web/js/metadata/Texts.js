const {Text} = require("./Text.js");

module.exports.Texts = class {

    static create(body, type) {

        // TODO: if this is markdown, and we don't have the HTML version,
        // we need to add the HTML version by converting the markdown to HTML.

        let result = {};
        result[type] = body;
        return result;

    }

};
