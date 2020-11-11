"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationTagsBar = void 0;
const Chip_1 = __importDefault(require("@material-ui/core/Chip"));
const react_1 = __importDefault(require("react"));
const Tags_1 = require("polar-shared/src/tags/Tags");
const MUIButtonBar_1 = require("../mui/MUIButtonBar");
const ReactUtils_1 = require("../react/ReactUtils");
const Mapper_1 = require("polar-shared/src/util/Mapper");
exports.AnnotationTagsBar = ReactUtils_1.deepMemo((props) => {
    const tags = Mapper_1.Mappers.create(props.tags)
        .map(current => Object.values(current || {}))
        .map(Tags_1.Tags.onlyRegular)
        .map(Tags_1.Tags.sortByLabel)
        .collect();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(MUIButtonBar_1.MUIButtonBar, { className: "mb-1", style: { overflow: 'hidden' } }, tags.map(tag => react_1.default.createElement(Chip_1.default, { key: tag.label, style: {
                userSelect: 'none'
            }, label: tag.label, size: "small" })))));
});
//# sourceMappingURL=AnnotationTagsBar.js.map