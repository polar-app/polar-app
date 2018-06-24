class Tokens {

    static hyphenToCamelCase(key) {

        key = key.replace(/-([a-zA-Z])/g, (match) => {
            return match.replace("-", "").toUpperCase();
        });

        return key;

    }

}

module.exports.Tokens = Tokens;
