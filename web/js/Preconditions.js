class Preconditions {

    /**
     *
     * @param value
     * @param testFunction {Function} Assert that the test function returns true
     * @param message
     * @return {*} Return the value we've been given.
     */
    static assert(value, testFunction, message) {

        Preconditions.assertNotNull(testFunction, "testFunction");

        let result = testFunction(value);

        if(!result) {
            throw new Error("Assertion failed: " + message);
        }

        return value;

    }

    /**
     * Assert that this value is defined , not-null, and also not NaN and also a number.
     * @param value
     * @param expected The expected value.
     * @param name
     * @return {number}
     */
    static assertEqual(value, expected, name) {

        if(value !== expected) {
            throw new Error(`Value of ${value} !==- ${expected}`);
        }

        return value;

    }

    /**
     * Assert that this value is defined , not-null, and also not NaN and also a number.
     * @param value {number} The value we expect to be a number.
     * @param name {string} The name of the number.
     * @return {number}
     */
    static assertNumber(value, name) {

        Preconditions.assertNotNull(value, name);

        if(isNaN(value)) {
            throw new Error(`Precondition failure for ${name}: NaN`);
        }

        Preconditions.assertTypeOf(value, name, "number");

        return value;

    }

    static assertInstanceOf(value, name, instance) {

        if ((value instanceof instance)) {
            throw new Error(`Precondition for instanceof '${name}' was not ${instance}.`);
        }

        return value;

    }

    static assertTypeOf(value, name, type) {

        if (!(typeof value === type)) {
            throw new Error(`Precondition for typeof '${name}' was not ${type}.`);
        }

        return value;

    }

    static assertNotNull(value, name) {

        if (value === null) {
            throw new Error(`Precondition (argument) for '${name}' null.`)
        }

        if (value === undefined) {
            throw new Error(`Precondition (argument) for '${name}' undefined.`)
        }

        return value;

    }

    static assertNotTypeOf(value, name, type) {

        if (typeof value === type ) {
            throw new Error(`Precondition for typeof '${name}' was ${type} but not allowed`);
        }

        return value;

    }

    static assertNotInstanceOf(value, name, instance) {

        if (value instanceof instance) {
            throw new Error(`Precondition for instanceof '${name}' was ${instance} but not allowed`);
        }

        return value;

    }

    static assertTypeof(value, name, expected) {

        if (typeof value !== expected ) {
            throw new Error(`Precondition for typeof '${name}' was not ${expected} but actually: ` + typeof value);
        }

        return value;

    }

    /**
     * Use a default value if one is not specified.
     *
     * @param currentValue
     * @param defaultValue
     * @return {*}
     */
    static defaultValue(currentValue, defaultValue) {

        if(! currentValue) {
            return defaultValue;
        }

        return currentValue;

    }

};

module.exports.Preconditions = Preconditions;
