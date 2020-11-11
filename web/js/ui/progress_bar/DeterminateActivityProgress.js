"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeterminateActivityProgress = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../../react/ReactUtils");
exports.DeterminateActivityProgress = ReactUtils_1.deepMemo((props) => {
    return (react_1.default.createElement("progress", { id: props.id, value: props.value, style: {
            height: '4px',
            width: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 99999999999,
            borderTop: 0,
            borderLeft: 0,
            borderBottom: 0,
            padding: 0,
            borderRadius: 0
        } }));
});
//# sourceMappingURL=DeterminateActivityProgress.js.map