"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discounts = void 0;
const DISCOUNTS = [];
class Discounts {
    constructor(delegate = {}) {
        this.delegate = delegate;
    }
    get(interval, plan) {
        const key = Discounts.key(interval, plan);
        return this.delegate[key] || undefined;
    }
    static key(interval, plan) {
        return `${interval}:${plan}`;
    }
    static create() {
        const backing = {};
        for (const discount of DISCOUNTS) {
            const key = this.key(discount.interval, discount.plan);
            backing[key] = discount;
        }
        return new Discounts(backing);
    }
}
exports.Discounts = Discounts;
//# sourceMappingURL=Discounts.js.map