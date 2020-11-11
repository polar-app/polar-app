"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CIDProviders = void 0;
const CIDProvider_1 = require("./CIDProvider");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
class CIDProviders {
    static getInstance() {
        return Optional_1.Optional.of(window.localStorage.getItem('cidProvider'))
            .map(value => new CIDProvider_1.CIDProvider(value))
            .getOrNull();
    }
    static setInstance(provider) {
        const value = provider.get();
        if (value) {
            window.localStorage.setItem('cidProvider', value);
        }
    }
}
exports.CIDProviders = CIDProviders;
//# sourceMappingURL=CIDProviders.js.map