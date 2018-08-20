"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
const Optional_1 = require("./ts/Optional");
class Functions {
    static functionToScript(_function, ..._opts) {
        let result = "";
        result += _function.toString();
        result += "\n";
        if (_opts) {
            result += `${_function.name}(${JSON.stringify(_opts)});`;
        }
        else {
            result += `${_function.name}();`;
        }
        return result;
    }
    static forDict(dict, callback) {
        Preconditions_1.Preconditions.assertNotNull(dict, "dict");
        Preconditions_1.Preconditions.assertNotNull(callback, "callback");
        let keys = Object.keys(dict);
        keys.forEach((key) => {
            let value = dict[key];
            callback(key, value);
        });
    }
    ;
    static forOwnKeys(dict, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertNotNull(dict, "dict");
            Preconditions_1.Preconditions.assertNotNull(callback, "callback");
            for (let key in dict) {
                if (dict.hasOwnProperty(key)) {
                    let value = dict[key];
                    yield callback(key, value);
                }
            }
        });
    }
    ;
    static withTimeout(timeout, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    callback().then((result) => resolve(result))
                        .catch((err) => reject(err));
                }, timeout);
            });
        });
    }
    static waitFor(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        });
    }
    static createSiblingTuples(arrayLikeObject) {
        return Functions.createSiblings(arrayLikeObject);
    }
    static createSiblings(arrayLikeObject) {
        Preconditions_1.Preconditions.assertNotNull(arrayLikeObject, "arrayLikeObject");
        let result = [];
        for (let idx = 0; idx < arrayLikeObject.length; ++idx) {
            result.push({
                curr: arrayLikeObject[idx],
                prev: Optional_1.Optional.of(arrayLikeObject[idx - 1]).getOrElse(null),
                next: Optional_1.Optional.of(arrayLikeObject[idx + 1]).getOrElse(null)
            });
        }
        return result;
    }
    ;
}
exports.Functions = Functions;
function forDict(dict, callback) {
    return Functions.forDict(dict, callback);
}
exports.forDict = forDict;
function forOwnKeys(dict, callback) {
    return Functions.forOwnKeys(dict, callback);
}
exports.forOwnKeys = forOwnKeys;
function createSiblingTuples(arrayLikeObject) {
    return Functions.createSiblingTuples(arrayLikeObject);
}
exports.createSiblingTuples = createSiblingTuples;
function createSiblings(arrayLikeObject) {
    return Functions.createSiblings(arrayLikeObject);
}
exports.createSiblings = createSiblings;
//# sourceMappingURL=Functions.js.map