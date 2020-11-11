"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageTypes = exports.Image = void 0;
const SerializedObject_1 = require("./SerializedObject");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class Image extends SerializedObject_1.SerializedObject {
    constructor(opts) {
        super(opts);
        this.id = opts.id;
        this.type = opts.type;
        this.src = opts.src;
        this.width = opts.width;
        this.height = opts.height;
        this.rel = opts.rel;
        this.init(opts);
    }
    validate() {
        super.validate();
        Preconditions_1.Preconditions.assertPresent(this.type, "type");
        Preconditions_1.Preconditions.assertPresent(this.src, "src");
    }
}
exports.Image = Image;
var ImageTypes;
(function (ImageTypes) {
    ImageTypes["GIF"] = "image/gif";
    ImageTypes["PNG"] = "image/png";
    ImageTypes["JPEG"] = "image/jpeg";
    ImageTypes["WEBP"] = "image/webp";
    ImageTypes["SVG"] = "image/svg+xml";
})(ImageTypes = exports.ImageTypes || (exports.ImageTypes = {}));
//# sourceMappingURL=Image.js.map