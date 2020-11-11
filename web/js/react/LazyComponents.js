"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazyEquals = exports.lazyObjEquals = void 0;
function lazyObjEquals(a, b) {
    for (const key of Object.keys(a)) {
        if (!lazyEquals(a[key], b[key])) {
            return false;
        }
    }
    return true;
}
exports.lazyObjEquals = lazyObjEquals;
function typ(val) {
    if (val === null) {
        return 'null';
    }
    return typeof val;
}
function lazyEquals(a, b) {
    const nrUndefined = [a, b].filter(val => val === undefined).length;
    const nrNull = [a, b].filter(val => val === null).length;
    if ([1].includes(nrUndefined)) {
        return false;
    }
    if ([1].includes(nrNull)) {
        return false;
    }
    const aObj = a;
    const bObj = b;
    if (aObj && aObj.oid && bObj && bObj.oid) {
        return aObj.oid === bObj.oid;
    }
    return a === b;
}
exports.lazyEquals = lazyEquals;
//# sourceMappingURL=LazyComponents.js.map