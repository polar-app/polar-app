"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Styles = exports.OffsetCalculator = exports.elementOffset = exports.getBoundingClientRectFromBCRs = exports.getBoundingClientRectFromElements = exports.forDict = exports.Delegator = exports.injectScript = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Rects_1 = require("./Rects");
function injectScript(src, type) {
    let script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.defer = false;
    if (type) {
        script.type = type;
    }
    return new Promise(function (resolve, reject) {
        document.head.appendChild(script);
        script.addEventListener('load', function () {
            resolve();
        });
        script.addEventListener('error', function (err) {
            reject(err);
        });
    });
}
exports.injectScript = injectScript;
class Delegator {
    constructor(delegates) {
        this.delegates = delegates;
    }
    apply(functionName, ...rest) {
        let args = Array.from(arguments);
        args.splice(0, 1);
        this.delegates.forEach(function (delegate) {
            let func = delegate[functionName];
            func.apply(delegate, args);
        });
    }
}
exports.Delegator = Delegator;
function forDict(dict, callback) {
    Preconditions_1.Preconditions.assertNotNull(dict, "dict");
    Preconditions_1.Preconditions.assertNotNull(callback, "callback");
    let keys = Object.keys(dict);
    keys.forEach(function (key) {
        let value = dict[key];
        callback(key, value);
    });
}
exports.forDict = forDict;
function getBoundingClientRectFromElements(elements) {
    let boundingClientRects = elements.map(current => current.getBoundingClientRect());
    return getBoundingClientRectFromBCRs(boundingClientRects);
}
exports.getBoundingClientRectFromElements = getBoundingClientRectFromElements;
;
function getBoundingClientRectFromBCRs(boundingClientRects) {
    let left = boundingClientRects.map((brc) => brc.left).reduce((a, b) => Math.min(a, b));
    let top = boundingClientRects.map((brc) => brc.top).reduce((a, b) => Math.min(a, b));
    let bottom = boundingClientRects.map((brc) => brc.bottom).reduce((a, b) => Math.max(a, b));
    let right = boundingClientRects.map((brc) => brc.right).reduce((a, b) => Math.max(a, b));
    return { left, top, bottom, right };
}
exports.getBoundingClientRectFromBCRs = getBoundingClientRectFromBCRs;
;
function elementOffset(element) {
    let result = {
        left: element.offsetLeft,
        top: element.offsetTop,
        width: element.offsetWidth,
        height: element.offsetHeight,
        right: 0,
        bottom: 0
    };
    result.right = result.left + result.width;
    result.bottom = result.top + result.height;
    return Rects_1.Rects.validate(result);
}
exports.elementOffset = elementOffset;
class OffsetCalculator {
    static calculate(element, rootElement) {
        let offset = { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 };
        while (true) {
            if (element == null)
                break;
            offset.left += this._toInt(element.offsetLeft);
            offset.top += this._toInt(element.offsetTop);
            offset.width = this._toInt(element.offsetWidth);
            offset.height = this._toInt(element.offsetHeight);
            if (element === rootElement)
                break;
            element = element.offsetParent;
        }
        offset.right = offset.left + offset.width;
        offset.bottom = offset.top + offset.height;
        return Rects_1.Rects.validate(offset);
    }
    static _toInt(value) {
        if (isNaN(value)) {
            return 0;
        }
        return value;
    }
}
exports.OffsetCalculator = OffsetCalculator;
class Styles {
    static parseTransformScaleX(transform) {
        let result = transform;
        if (!result)
            return null;
        result = result.replace("scaleX(", "");
        result = result.replace(")", "");
        return parseFloat(result);
    }
    static parsePixels(value) {
        value = value.replace("px", "");
        return parseInt(value);
    }
}
exports.Styles = Styles;
//# sourceMappingURL=utils.js.map