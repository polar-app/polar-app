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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentDropdown2 = void 0;
const React = __importStar(require("react"));
const MUIMenu_1 = require("../../mui/menu/MUIMenu");
const MoreVert_1 = __importDefault(require("@material-ui/icons/MoreVert"));
const MUIMenuItem_1 = require("../../mui/menu/MUIMenuItem");
const Delete_1 = __importDefault(require("@material-ui/icons/Delete"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const AnnotationMutationsContext_1 = require("../AnnotationMutationsContext");
exports.CommentDropdown2 = React.memo((props) => {
    const annotationMutations = AnnotationMutationsContext_1.useAnnotationMutationsContext();
    const { comment } = props;
    const handleDelete = annotationMutations.createDeletedCallback({ selected: [comment] });
    return (React.createElement(MUIMenu_1.MUIMenu, { id: props.id, button: {
            icon: React.createElement(MoreVert_1.default, null),
            disabled: props.disabled,
            size: 'small'
        }, placement: 'bottom-end' },
        React.createElement("div", null,
            React.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Delete", icon: React.createElement(Delete_1.default, null), onClick: handleDelete }))));
}, react_fast_compare_1.default);
//# sourceMappingURL=CommentDropdown2.js.map