const {Preconditions} = require("../Preconditions");

class Functions {

    /**
     * Take a function and make it an external script we can pass to an external
     * javascript interpreter. This can be used with the electron renderer, chrome
     * headless, etc.
     *
     * @param _function
     * @param _opts
     * @return {string}
     */
    static functionToScript(_function, _opts) {

        let result = "";
        result += _function.toString();
        result += "\n";
        result += `${_function.name}(${JSON.stringify(_opts)});`;
        return result;

    }

    static forDict(dict, callback) {

        Preconditions.assertNotNull(dict, "dict");
        Preconditions.assertNotNull(callback, "callback");

        // get the keys first, that way we can mutate the dictionary while iterating
        // through it if necessary.
        let keys = Object.keys(dict);

        keys.forEach(function (key) {
            let value = dict[key];
            callback(key,value);
        })

    };

}

module.exports.Functions = Functions;
