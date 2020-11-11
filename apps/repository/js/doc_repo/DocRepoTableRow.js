"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoTableRow = void 0;
const react_1 = __importDefault(require("react"));
const TableRow_1 = __importDefault(require("@material-ui/core/TableRow"));
const TableCell_1 = __importDefault(require("@material-ui/core/TableCell"));
const AutoBlur_1 = require("./AutoBlur");
const Checkbox_1 = __importDefault(require("@material-ui/core/Checkbox"));
const styles_1 = require("@material-ui/core/styles");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const DocRepoStore2_1 = require("./DocRepoStore2");
const DocRepoTableRowInner_1 = require("./DocRepoTableRowInner");
const DocRepoTable2_1 = require("./DocRepoTable2");
const MUIHoverStore_1 = require("../../../../web/js/mui/MUIHoverStore");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    root: {
        width: '100%',
        height: '100%',
    },
    paper: {
        width: '100%',
        height: '100%',
    },
    table: {
        minWidth: 0,
        maxWidth: '100%',
        tableLayout: 'fixed'
    },
    tr: {},
    td: {
        whiteSpace: 'nowrap'
    },
}));
const Delegate = react_1.default.memo((props) => {
    const classes = useStyles();
    const callbacks = DocRepoStore2_1.useDocRepoCallbacks();
    const { selectRow } = callbacks;
    const { viewIndex, selected, row } = props;
    const labelId = `enhanced-table-checkbox-${viewIndex}`;
    const contextMenuHandlers = DocRepoTable2_1.useDocRepoContextMenu();
    const hoverListener = MUIHoverStore_1.useMUIHoverListener();
    return (react_1.default.createElement(TableRow_1.default, Object.assign({}, contextMenuHandlers, hoverListener, { style: props.style, hover: true, className: classes.tr, role: "checkbox", "aria-checked": selected, draggable: true, onDragStart: callbacks.onDragStart, onDragEnd: callbacks.onDragEnd, onDoubleClick: callbacks.onOpen, selected: selected }),
        react_1.default.createElement(TableCell_1.default, { padding: "none" },
            react_1.default.createElement(AutoBlur_1.AutoBlur, null,
                react_1.default.createElement(Checkbox_1.default, { checked: selected, inputProps: { 'aria-labelledby': labelId }, onClick: (event) => selectRow(row.id, event, 'checkbox') }))),
        react_1.default.createElement(DocRepoTableRowInner_1.DocRepoTableRowInner, { viewIndex: props.viewIndex, rawContextMenuHandler: props.rawContextMenuHandler, row: props.row })));
}, react_fast_compare_1.default);
exports.DocRepoTableRow = react_1.default.memo((props) => (react_1.default.createElement(MUIHoverStore_1.MUIHoverStoreProvider, { initialValue: false },
    react_1.default.createElement(Delegate, Object.assign({}, props)))));
//# sourceMappingURL=DocRepoTableRow.js.map