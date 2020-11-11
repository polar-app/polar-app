"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CIDs = void 0;
const uuid_1 = require("uuid");
const CIDProviders_1 = require("./CIDProviders");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const CIDProvider_1 = require("./CIDProvider");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const KEY = 'ga_cid';
class CIDs {
    static get() {
        let cid = this.fetch();
        if (!cid) {
            cid = this.create();
        }
        this.set(cid);
        return cid;
    }
    static fetch() {
        const mainCID = Optional_1.Optional.of(CIDProviders_1.CIDProviders.getInstance())
            .filter(current => Preconditions_1.isPresent(current))
            .map(current => current.get())
            .getOrUndefined();
        const localCID = window.localStorage.getItem(KEY);
        return Optional_1.Optional.first(mainCID, localCID).getOrUndefined();
    }
    static set(cid) {
        window.localStorage.setItem(KEY, cid);
        CIDProviders_1.CIDProviders.setInstance(new CIDProvider_1.CIDProvider(cid));
    }
    static create() {
        return uuid_1.v4();
    }
}
exports.CIDs = CIDs;
//# sourceMappingURL=CIDs.js.map