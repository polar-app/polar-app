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
exports.AdvertisingPersistenceLayer = void 0;
const DocInfoAdvertiser_1 = require("./DocInfoAdvertiser");
const DocInfoAdvertisementListenerService_1 = require("./DocInfoAdvertisementListenerService");
const AbstractAdvertisingPersistenceLayer_1 = require("./AbstractAdvertisingPersistenceLayer");
class AdvertisingPersistenceLayer extends AbstractAdvertisingPersistenceLayer_1.AbstractAdvertisingPersistenceLayer {
    constructor(delegate) {
        super(delegate);
        this.docInfoAdvertisementListenerService = new DocInfoAdvertisementListenerService_1.DocInfoAdvertisementListenerService();
        this.id = 'advertising:' + delegate.id;
    }
    init(errorListener, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            this.docInfoAdvertisementListenerService
                .addEventListener((adv) => this.onDocInfoAdvertisement(adv));
            this.docInfoAdvertisementListenerService.start();
            yield this.delegate.init(errorListener, opts);
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.docInfoAdvertisementListenerService.stop();
            return this.delegate.stop();
        });
    }
    broadcastEvent(event) {
        DocInfoAdvertiser_1.DocInfoAdvertiser.send({
            docMeta: event.docMeta,
            docInfo: event.docInfo,
            advertisementType: event.eventType
        });
    }
    onDocInfoAdvertisement(docInfoAdvertisement) {
        this.dispatchEvent({
            docMetaRef: {
                fingerprint: docInfoAdvertisement.docInfo.fingerprint,
                filename: docInfoAdvertisement.docInfo.filename,
                docInfo: docInfoAdvertisement.docInfo
            },
            docMeta: docInfoAdvertisement.docMeta,
            docInfo: docInfoAdvertisement.docInfo,
            eventType: docInfoAdvertisement.advertisementType
        });
    }
}
exports.AdvertisingPersistenceLayer = AdvertisingPersistenceLayer;
//# sourceMappingURL=AdvertisingPersistenceLayer.js.map