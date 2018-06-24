const {Tokens} = require("./Tokens");
const {Strings} = require("./Strings");
const {Preconditions} = require("../Preconditions");

class Attributes {

    /**
     * Extract data attributes on an element as a map.
     *
     */
    static dataToMap(element) {

        let result = {};

        Preconditions.assertNotNull(element, "element");

        Array.from(element.attributes).forEach((attr) => {

            if(attr.name.startsWith("data-")) {
                let key = attr.name;
                key = key.replace("data-", "");
                key = Tokens.hyphenToCamelCase(key);
                result[key] = Strings.toPrimitive(attr.value);
            }

        });

        return result;

    }

}

module.exports.Attributes = Attributes;
