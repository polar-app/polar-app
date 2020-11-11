"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntersectionList = void 0;
const React = __importStar(require("react"));
const Arrays_1 = require("polar-shared/src/util/Arrays");
const IntersectionListBlock_1 = require("./IntersectionListBlock");
const ReactHooks_1 = require("../hooks/ReactHooks");
exports.IntersectionList = ReactHooks_1.typedMemo(function (props) {
    const blockSize = props.blockSize || 25;
    const blocks = Arrays_1.Arrays.createBatches(props.values, blockSize);
    const Block = IntersectionListBlock_1.IntersectionListBlock;
    return (React.createElement(React.Fragment, null, blocks.map((block, idx) => (React.createElement(IntersectionListBlock_1.IntersectionListBlock, { key: idx, root: props.root, values: block, blockSize: blockSize, blockIndex: idx, blockComponent: props.blockComponent, visibleComponent: props.visibleComponent, hiddenComponent: props.hiddenComponent })))));
});
//# sourceMappingURL=IntersectionList.js.map