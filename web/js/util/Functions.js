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

        // TODO: expand _opts to varargs... not just one opts.  This way the
        // function can be an ordinary function.
        if(_opts) {
            result += `${_function.name}(${JSON.stringify(_opts)});`;
        } else {
            result += `${_function.name}();`;
        }
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

    /**
     * Calls the given callback as a promise which we can await.
     */
    static async withTimeout(timeout, callback) {

        return new Promise((resolve,reject) => {

            setTimeout(() => {
                callback().then(result => resolve(result))
                          .catch(err => reject(err));
            }, timeout);

        });

    }

    /**
     * A promise based timeout.  This just returns a promise which returns
     * once the timeout has expired. You can then call .then() or just await
     * the timeout.
     *
     * @param timeout
     * @return {Promise<void>}
     */
    static async waitFor(timeout) {

        return new Promise(resolve => {

            setTimeout(() => {
                resolve();
            }, timeout);

        });

    }

}

module.exports.forDict = Functions.forDict;
module.exports.Functions = Functions;
