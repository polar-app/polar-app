"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Percentages {
    static round(perc) {
        return Math.round(perc * 100) / 100;
    }
}
exports.Percentages = Percentages;
function round(perc) {
    return Percentages.round(perc);
}
exports.round = round;
//# sourceMappingURL=Percentages.js.map