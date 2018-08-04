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
        else {
            throw new Error("Invalid type: " + typeof val);
        }
    }
    toDate() {
        return Date.parse(this.value);
    }
    toJSON() {
        return this.value;
    }
    toString() {
        return this.value;
    }
    duplicate() {
        return new ISODateTime(this.value);
    }
}
ISODateTime.EPOCH = new ISODateTime(new Date(0));
exports.ISODateTime = ISODateTime;
//# sourceMappingURL=ISODateTime.js.map