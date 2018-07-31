export class Preconditions {


    /**
     *
     * @param value  The value we're trying to assert.
     *
     * @param testFunction Assert that the test function returns true
     * @param message
     * @return Return the value we've been given once it's passed assertions.
     */
    static assert<T>(value: T, testFunction: AssertionFunction<T>, message: string): T {

        Preconditions.assertNotNull(testFunction, "testFunction");

        let result = testFunction(value);

        if(!result) {
            throw new Error(`Assertion failed for value ${value}: ` + message);
        }

        return value;

    }

    /**
     * Assert that this value is defined , not-null, and also not NaN and also a
     * number.
     *
     */
    static assertEqual<T>(value: T, expected: T, name: string): T {

        if(value !== expected) {
            throw new Error(`Value of ${value} !==- ${expected}`);
        }

        return value;

    }

    /**
     * Assert that this value is defined , not-null, and also not NaN and also a number.
     * @param value The value we expect to be a number.
     * @param name The name of the number.
     * @return {number}
     */
    static assertNumber(value: any, name: string) {

        Preconditions.assertNotNull(value, name);

        if(isNaN(value)) {
            throw new Error(`Precondition failure for ${name}: NaN`);
        }

        Preconditions.assertTypeOf(value, "number", name);

        return value;

    }

    /**
     *
     * @param value {*}
     * @param instance {class}
     * @param name
     * @return {*}
     */
    static assertInstanceOf(value: any, instance: any, name: string) {

        Preconditions.assertNotNull(value, "value");
        Preconditions.assertNotNull(instance, "instance");

        if (! (value instanceof instance)) {
            throw new Error(`Precondition for instanceof '${name}' was not ${instance.name}.`);
        }

        return value;

    }

    /**
     *
     * @param value
     * @param type
     * @param name
     * @return value
     */
    static assertTypeOf(value: any, type: string, name: string): any {

        if (typeof value !== type) {
            throw new Error(`Precondition for typeof '${name}' was not ${type} but actually: ` + typeof value);
        }

        return value;

    }

    static assertNotNull<T>(value: T, name: string): T {

        if (value === null) {
            throw new Error(`Precondition (argument) for '${name}' null.`)
        }

        if (value === undefined) {
            throw new Error(`Precondition (argument) for '${name}' undefined.`)
        }

        return value;

    }

    static assertNotTypeOf<T>(value: any, name: string, type: string): T {

        if (typeof value === type ) {
            throw new Error(`Precondition for typeof '${name}' was ${type} but not allowed`);
        }

        return value;

    }

    static assertNotInstanceOf<T>(value: T, name: string, instance: any): T {

        if (value instanceof instance) {
            throw new Error(`Precondition for instanceof '${name}' was ${instance} but not allowed`);
        }

        return value;

    }

    /**
     * Use a default value if one is not specified.
     *
     * @param currentValue
     * @param defaultValue
     */
    static defaultValue<T>(currentValue: T, defaultValue: T): T {

        if(! currentValue) {
            return defaultValue;
        }

        return currentValue;

    }

}

interface AssertionFunction<T> {
    (val: T): boolean
}
