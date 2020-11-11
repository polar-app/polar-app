"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Images = void 0;
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
class Images {
    static createID() {
        return Hashcodes_1.Hashcodes.createRandomID(20);
    }
    static toExt(type) {
        switch (type) {
            case 'image/gif':
                return "gif";
            case 'image/png':
                return "png";
            case 'image/jpeg':
                return "png";
            case 'image/webp':
                return "webp";
            case 'image/svg+xml':
                return "svg";
        }
    }
    static toImg(docFileResolver, image) {
        if (!image) {
            return undefined;
        }
        const docFileMeta = docFileResolver(image.src.backend, image.src);
        const img = {
            width: image.width,
            height: image.height,
            src: docFileMeta.url
        };
        return img;
    }
}
exports.Images = Images;
//# sourceMappingURL=Images.js.map