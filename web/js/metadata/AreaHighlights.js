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
exports.AreaHighlights = void 0;
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const AreaHighlight_1 = require("./AreaHighlight");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Image_1 = require("./Image");
const Images_1 = require("./Images");
const DocMetas_1 = require("./DocMetas");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const ArrayBuffers_1 = require("polar-shared/src/util/ArrayBuffers");
const Attachment_1 = require("./Attachment");
const DatastoreFileCache_1 = require("../datastore/DatastoreFileCache");
const DataURLs_1 = require("polar-shared/src/util/DataURLs");
const Rects_1 = require("../Rects");
class AreaHighlights {
    static update(id, docMeta, pageMeta, updates) {
        const existing = pageMeta.areaHighlights[id];
        if (!existing) {
            throw new Error("No existing for id: " + id);
        }
        const updated = new AreaHighlight_1.AreaHighlight(Object.assign(Object.assign({}, existing), updates));
        pageMeta.areaHighlights[id] = updated;
    }
    static toCorrectScale2(overlayRect, currentScale) {
        const rescaleFactor = 1 / currentScale;
        return Rects_1.Rects.scale(Rects_1.Rects.createFromBasicRect(overlayRect), rescaleFactor);
    }
    static createID(created) {
        return Hashcodes_1.Hashcodes.createID(created);
    }
    static create(opts = {}) {
        Preconditions_1.Preconditions.assertNotNull(opts.rect, "rect");
        const created = ISODateTimeStrings_1.ISODateTimeStrings.create();
        const id = AreaHighlights.createID(created);
        return new AreaHighlight_1.AreaHighlight({
            id,
            guid: id,
            created,
            rects: { "0": opts.rect }
        });
    }
    static createWriter(opts) {
        return new DefaultAreaHighlightWriter(opts);
    }
    static delete(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { datastore, docMeta, pageMeta, areaHighlight } = opts;
            const { image } = areaHighlight;
            DocMetas_1.DocMetas.withBatchedMutations(docMeta, () => {
                delete pageMeta.areaHighlights[areaHighlight.id];
                if (image) {
                    delete docMeta.docInfo.attachments[image.id];
                }
            });
            if (image) {
                yield datastore.deleteFile(image.src.backend, image.src);
            }
        });
    }
}
exports.AreaHighlights = AreaHighlights;
class DefaultAreaHighlightWriter {
    constructor(opts) {
        this.opts = opts;
        Preconditions_1.Preconditions.assertPresent(opts, 'opts');
        Preconditions_1.Preconditions.assertPresent(opts.capturedScreenshot, 'opts.capturedScreenshot');
    }
    prepare() {
        const { docMeta, capturedScreenshot, pageMeta, areaHighlight, areaHighlightRect, position } = this.opts;
        Preconditions_1.Preconditions.assertPresent(capturedScreenshot, 'capturedScreenshot');
        const { type, width, height } = capturedScreenshot;
        const id = Images_1.Images.createID();
        const ext = Images_1.Images.toExt(type);
        const fileRef = {
            backend: Backend_1.Backend.IMAGE,
            name: `${id}.${ext}`
        };
        const oldImage = areaHighlight.image;
        const image = new Image_1.Image({
            id, type, width, height,
            rel: 'screenshot',
            src: fileRef,
        });
        const toBlob = () => {
            if (typeof capturedScreenshot.data === 'string') {
                return DataURLs_1.DataURLs.toBlob(capturedScreenshot.data);
            }
            else {
                return ArrayBuffers_1.ArrayBuffers.toBlob(capturedScreenshot.data);
            }
        };
        const blob = toBlob();
        const blobURL = URL.createObjectURL(blob);
        DatastoreFileCache_1.DatastoreFileCache.writeFile(Backend_1.Backend.IMAGE, image.src, {
            url: blobURL
        });
        if (areaHighlight.image) {
            delete docMeta.docInfo.attachments[areaHighlight.image.id];
        }
        docMeta.docInfo.attachments[image.id] = new Attachment_1.Attachment({ fileRef });
        const rects = {};
        rects["0"] = areaHighlightRect;
        const newAreaHighlight = new AreaHighlight_1.AreaHighlight(Object.assign(Object.assign({}, areaHighlight), { image,
            rects,
            position, lastUpdated: ISODateTimeStrings_1.ISODateTimeStrings.create() }));
        delete pageMeta.areaHighlights[areaHighlight.id];
        pageMeta.areaHighlights[newAreaHighlight.id] = newAreaHighlight;
        const committer = new DefaultAreaHighlightCommitter(this.opts, image, blob, oldImage);
        return [newAreaHighlight, committer];
    }
}
class DefaultAreaHighlightCommitter {
    constructor(opts, image, blob, oldImage) {
        this.opts = opts;
        this.image = image;
        this.blob = blob;
        this.oldImage = oldImage;
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            const { datastore, docMeta } = this.opts;
            const { image, oldImage, blob } = this;
            const writeFilePromise = datastore.writeFile(image.src.backend, image.src, blob);
            const deleteFilePromise = oldImage ? datastore.deleteFile(oldImage.src.backend, oldImage.src) : Promise.resolve();
            const writeDocMetaPromise = datastore.writeDocMeta(docMeta);
            yield Promise.all([
                writeFilePromise,
                deleteFilePromise,
                writeDocMetaPromise
            ]);
        });
    }
}
//# sourceMappingURL=AreaHighlights.js.map