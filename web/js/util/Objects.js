"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Objects {
    static defaults(current, defaults) {
        let result = current;
        if (!result) {
            result = {};
        }
        for (let key in defaults) {
            if (defaults.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
                result[key] = defaults[key];
            }
        }
        return result;
    }
    static clear(obj) {
        if (obj instanceof Array) {
            for (let idx = 0; idx < obj.length; ++idx) {
                obj.pop();
            }
            return obj;
        }
        if (typeof obj === "object") {
            for (let key in obj) {
                delete obj[key];
            }
            return obj;
        }
        throw new Error("Only works for arrays or objects");
    }
    static duplicate(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    static create(proto) {
        return Object.create(proto);
    }
    static createInstance(prototype, val) {
        let result = Objects.create(prototype);
        Object.assign(result, val);
        return result;
    }
}
exports.Objects = Objects;
function create(proto) {
    return Object.create(proto);
}
function createInstance(prototype, val) {
    let result = create(prototype);
    Object.assign(result, val);
    return result;
}
//# sourceMappingURL=Objects.js.map