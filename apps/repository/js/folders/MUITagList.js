"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUITagList = void 0;
const react_1 = __importDefault(require("react"));
const MUITagListItem_1 = require("./MUITagListItem");
exports.MUITagList = (props) => {
    const { selected } = props;
    return (react_1.default.createElement(react_1.default.Fragment, null, props.tags.map(tag => react_1.default.createElement(MUITagListItem_1.MUITagListItem, { key: tag.id, selected: selected.includes(tag.id), selectRow: props.selectRow, nodeId: tag.id, label: tag.label, onDrop: props.onDrop, info: tag.count }))));
};
//# sourceMappingURL=MUITagList.js.map