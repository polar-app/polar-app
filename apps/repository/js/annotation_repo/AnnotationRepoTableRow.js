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
exports.AnnotationRepoTableRow = void 0;
const React = __importStar(require("react"));
const TableCell_1 = __importDefault(require("@material-ui/core/TableCell"));
const AnnotationPreview_1 = require("./AnnotationPreview");
const TableRow_1 = __importDefault(require("@material-ui/core/TableRow"));
const AnnotationRepoStore_1 = require("./AnnotationRepoStore");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const AnnotationRepoTable2_1 = require("./AnnotationRepoTable2");
exports.AnnotationRepoTableRow = React.memo(React.forwardRef((props, ref) => {
    const { viewIndex, annotation, rowSelected } = props;
    const callbacks = AnnotationRepoStore_1.useAnnotationRepoCallbacks();
    const { onDragStart, onDragEnd } = callbacks;
    const onClick = React.useCallback((event) => {
        callbacks.selectRow(annotation.id, event, 'click');
    }, [callbacks, annotation]);
    const onContextMenu = React.useCallback((event) => {
        callbacks.selectRow(annotation.id, event, 'context');
    }, [callbacks, annotation]);
    const contextMenu = AnnotationRepoTable2_1.useAnnotationRepoTableContextMenu({ onContextMenu });
    return (React.createElement(TableRow_1.default, Object.assign({}, contextMenu, { key: viewIndex, hover: true, role: "checkbox", onClick: onClick, draggable: true, onDragStart: onDragStart, onDragEnd: onDragEnd, selected: rowSelected }),
        React.createElement(TableCell_1.default, { padding: "checkbox" },
            React.createElement(AnnotationPreview_1.AnnotationPreview, { id: annotation.id, text: annotation.text, img: annotation.img, color: annotation.color, lastUpdated: annotation.lastUpdated, created: annotation.created }))));
}), react_fast_compare_1.default);
//# sourceMappingURL=AnnotationRepoTableRow.js.map