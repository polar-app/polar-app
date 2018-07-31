"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Preconditions {
    static assert(value, testFunction, message) {
        Preconditions.assertNotNull(testFunction, "testFunction");
        let result = testFunction(value);
        if (!result) {
            throw new Error(`Assertion failed for value ${value}: ` + message);
        }
        return value;
    }
    static assertEqual(value, expected, name) {
        if (value !== expected) {
            throw new Error(`Value of ${value} !==- ${expected}`);
        }
        return value;
    }
    static assertNumber(value, name) {
        Preconditions.assertNotNull(value, name);
        if (isNaN(value)) {
            throw new Error(`Precondition failure for ${name}: NaN`);
        }
        Preconditions.assertTypeOf(value, "number", name);
        return value;
    }
    static assertInstanceOf(value, instance, name) {
        Preconditions.assertNotNull(value, "value");
        Preconditions.assertNotNull(instance, "instance");
        if (!(value instanceof instance)) {
            throw new Error(`Precondition for instanceof '${name}' was not ${instance.name}.`);
        }
        return value;
    }
    static assertTypeOf(value, type, name) {
        if (typeof value !== type) {
            throw new Error(`Precondition for typeof '${name}' was not ${type} but actually: ` + typeof value);
        }
        return value;
    }
    static assertNotNull(value, name) {
        if (value === null) {
            throw new Error(`Precondition (argument) for '${name}' null.`);
        }
        if (value === undefined) {
            throw new Error(`Precondition (argument) for '${name}' undefined.`);
        }
        return value;
    }
    static assertNotTypeOf(value, name, type) {
        if (typeof value === type) {
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
    static defaultValue(currentValue, defaultValue) {
        if (!currentValue) {
            return defaultValue;
        }
        return currentValue;
    }
}
exports.Preconditions = Preconditions;
//# sourceMappingURL=Preconditions.js.map