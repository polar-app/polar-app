"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalSetting = void 0;
const Optional_1 = require("polar-shared/src/util/ts/Optional");
class ConditionalSetting {
    constructor(key) {
        this.key = key;
    }
    accept(predicate) {
        return predicate(this.get());
    }
    get() {
        return Optional_1.Optional.of(window.localStorage.getItem(this.key));
    }
    set(value) {
        window.localStorage.setItem(this.key, value);
    }
}
exports.ConditionalSetting = ConditionalSetting;
//# sourceMappingURL=ConditionalSetting.js.map