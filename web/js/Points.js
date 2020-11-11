"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Points = void 0;
class Points {
    static relativeTo(origin, point) {
        return {
            x: Math.round(point.x - origin.x),
            y: Math.round(point.y - origin.y)
        };
    }
}
exports.Points = Points;
//# sourceMappingURL=Points.js.map