const $ = require('jquery');

const {Preconditions} = require("./Preconditions");
const {Rects} = require("./Rects");
const {Functions} = require("./util/Functions");

module.exports.injectScript = function(src,type) {

    let script = document.createElement('script');
    script.src = src;

    // loading async is ugly but we're going to move to webpack and clean this
    // up eventually.
    script.async = false;
    script.defer = false;

    if(type)
        script.type = type;

    return new Promise(function (resolve, reject) {

        document.head.appendChild(script);

        script.addEventListener('load', function() {
            resolve();
        });

        script.addEventListener('error', function(err) {
            reject(err);
        });

    });

};

/**
 * Apply a given function, with arguments, to a list of delegates which have
 * that function name defined.
 */
module.exports.Delegator = class {

    constructor(delegates) {
        this.delegates = delegates;
    }

    /**
     * Apply the given function to all the delegates.
     */
    apply(functionName) {

        let args = Array.from(arguments);
        args.splice(0,1);

        this.delegates.forEach(function (delegate) {
            let func = delegate[functionName];
            func.apply(delegate, args);
        });
    }

};

// @Deprecated use Functions.forDict
module.exports.forDict = function(dict, callback) {

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
 * Get the bounding box for a list of elements, not just one.  This would be
 * the minimum bounding box for all the elements.
 */
module.exports.getBoundingClientRectFromElements = function(elements) {

    let boundingClientRects = elements.map(Element.getBoundingClientRect);
    return getBoundingClientRectFromBCRs(boundingClientRects);

};

/**
 * Get the bounding box from a list of BCRs.
 */
module.exports.getBoundingClientRectFromBCRs = function(boundingClientRects) {

    let left = boundingClientRects.map((brc) => brc.left).reduce((a,b) => Math.min(a,b));
    let top = boundingClientRects.map((brc) => brc.top).reduce((a,b) => Math.min(a,b));
    let bottom = boundingClientRects.map((brc) => brc.bottom).reduce((a,b) => Math.max(a,b));
    let right = boundingClientRects.map((brc) => brc.right).reduce((a,b) => Math.max(a,b));

    return {left, top, bottom, right};

};

/**
 * @Deprecated use Elements.offset instead.
 */
module.exports.elementOffset = function(element) {

    let result = {
        left: element.offsetLeft,
        top: element.offsetTop,
        width: element.offsetWidth,
        height: element.offsetHeight
    };

    result.right = result.left + result.width;
    result.bottom = result.top + result.height;

    return Rects.validate(result);

}

/**
 * Support the ability to calculate an offset relative to another element.
 */
module.exports.OffsetCalculator = class {

    // https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document
    static calculate(element, rootElement) {

        let offset = {left: 0, top: 0, width: 0, height: 0};

        while(true) {

            if(element == null)
                break;

            offset.left += this._toInt(element.offsetLeft);
            offset.top += this._toInt(element.offsetTop);
            offset.width = this._toInt(element.offsetWidth);
            offset.height = this._toInt(element.offsetHeight);

            if(element === rootElement)
                break;

            element = element.offsetParent;

        }

        offset.right = offset.left + offset.width;
        offset.bottom = offset.top + offset.height;

        return Rects.validate(offset);

    }

    static _toInt(value) {

        if ( isNaN( value ) ) {
            return 0;
        }

        return value;

    }

};

module.exports.Styles = class {

    static parseTransformScaleX(transform) {

        let result = transform;

        if( ! result)
            return null;

        result = result.replace("scaleX(", "");
        result = result.replace(")", "");

        return parseFloat(result);

    }

    /**
     * Take a string of '50px' and return a number of just the pixel count.
     */
    static parsePixels(value) {

        value = value.replace("px", "");
        return parseInt(value);

    }

}

module.exports.createSiblingTuples = Functions.createSiblingTuples;

// @Deprecated.
module.exports.Objects = require("./util/Objects.js").Objects;
module.exports.Elements = require("./util/Elements.js").Elements;
