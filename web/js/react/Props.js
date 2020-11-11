"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Props = void 0;
class Props {
    static create(props) {
        const result = {};
        if (props.id) {
            result.id = props.id;
        }
        if (props.className) {
            result.className = props.className;
        }
        if (props.style) {
            result.style = props.style;
        }
        return result;
    }
    static merge(a, b) {
        var _a, _b, _c, _d;
        const result = {};
        if (a.id !== undefined || b.id !== undefined) {
            result.id = (_a = a.id) !== null && _a !== void 0 ? _a : b.id;
        }
        if (a.className !== undefined || b.className !== undefined) {
            if (a.className && b.className) {
                result.className = a.className + ' ' + b.className;
            }
            result.className = (_b = a.className) !== null && _b !== void 0 ? _b : b.className;
        }
        if (a.style !== undefined || b.style !== undefined) {
            result.style = Object.assign(Object.assign({}, ((_c = a.style) !== null && _c !== void 0 ? _c : {})), ((_d = b.style) !== null && _d !== void 0 ? _d : {}));
        }
        return result;
    }
}
exports.Props = Props;
//# sourceMappingURL=Props.js.map