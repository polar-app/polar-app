"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ISODateTime {
    constructor(val) {
        if (typeof val === "string") {
            this.value = val;
        }
        else if (val instanceof Date) {
            this.value = val.toISOString();
        }
        else if (val instanceof ISODateTime) {
            this.value = val.value;
        }
        else if (typeof val === "object" && typeof val.value === "string") {
            this.value = val.value;
        }
        else {
            throw new Error("Invalid type: " + typeof val);
        }
    }
    toDate() {
        return new Date(Date.parse(this.value));
    }
    toJSON() {
        return this.value;
    }
    toString() {
        return this.value;
    }
    equals(obj) {
        if (!(obj instanceof ISODateTime)) {
            return false;
        }
        return this.value === obj.value;
    }
    duplicate() {
        return new ISODateTime(this.value);
    }
}
ISODateTime.EPOCH = new ISODateTime(new Date(0));
exports.ISODateTime = ISODateTime;
//# sourceMappingURL=ISODateTime.js.map