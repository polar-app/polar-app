const {Text} = require("./Text.js");

module.exports.Texts = class {

    static create(body, type) {

        let result = {};
        result[type] = body;
        return result;

    }

};
