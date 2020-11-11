"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Canvases_1 = require("polar-shared/src/util/Canvases");
require("./index.scss");
const Blobs_1 = require("polar-shared/src/util/Blobs");
function showImage(thumbnail) {
    const dataURL = Canvases_1.ImageDatas.toDataURL(thumbnail);
    const img = document.createElement('img');
    img.setAttribute('src', dataURL);
    img.setAttribute('height', '' + thumbnail.height);
    img.setAttribute('width', '' + thumbnail.width);
    document.body.appendChild(img);
}
function doImageThumbnail() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('./example.jpg');
        const blob = yield response.blob();
        const ab = yield Blobs_1.Blobs.toArrayBuffer(blob);
        const thumbnail = yield Canvases_1.Canvases.resize(ab, { width: 384, height: 255 });
        showImage(thumbnail);
    });
}
function doAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        yield doImageThumbnail();
    });
}
doAsync().catch(err => console.error(err));
//# sourceMappingURL=index.js.map