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
exports.DocColumnsSelector = void 0;
const React = __importStar(require("react"));
const ListItemText_1 = __importDefault(require("@material-ui/core/ListItemText"));
const Checkbox_1 = __importDefault(require("@material-ui/core/Checkbox"));
const MUIDialog_1 = require("../../../../web/js/ui/dialogs/MUIDialog");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const ListItem_1 = __importDefault(require("@material-ui/core/ListItem"));
const List_1 = __importDefault(require("@material-ui/core/List"));
const Columns_1 = require("./Columns");
const DialogActions_1 = __importDefault(require("@material-ui/core/DialogActions"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const DialogTitle_1 = __importDefault(require("@material-ui/core/DialogTitle"));
const FilterList_1 = __importDefault(require("@material-ui/icons/FilterList"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
exports.DocColumnsSelector = (props) => {
    const [open, setOpen] = React.useState(false);
    const [columns, setColumns] = React.useState(props.columns);
    const handleToggleColumn = React.useCallback((column) => {
        if (columns.includes(column.id)) {
            setColumns(columns.filter(current => current !== column.id));
        }
        else {
            setColumns([...columns, column.id]);
        }
    }, [columns]);
    const toListItem = React.useCallback((column) => {
        return (React.createElement(ListItem_1.default, { key: column.id, button: true, onClick: () => handleToggleColumn(column) },
            React.createElement(Checkbox_1.default, { checked: columns.includes(column.id) }),
            React.createElement(ListItemText_1.default, { primary: column.label })));
    }, [columns, handleToggleColumn]);
    const handleAccept = React.useCallback(() => {
        setOpen(false);
        const newColumns = Columns_1.COLUMNS.filter(current => columns.includes(current.id))
            .map(current => current.id);
        props.onAccept(newColumns);
    }, [columns, props]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Box_1.default, { mr: 1 },
            React.createElement(IconButton_1.default, { size: "small", onClick: () => setOpen(true) },
                React.createElement(Box_1.default, { color: "text.secondary" },
                    React.createElement(FilterList_1.default, null)))),
        open && (React.createElement(MUIDialog_1.MUIDialog, { open: open, onClose: () => setOpen(false) },
            React.createElement(DialogTitle_1.default, null, "Change Visible Document Metadata Columns"),
            React.createElement(DialogContent_1.default, null,
                React.createElement(List_1.default, { style: { minWidth: '250px' } }, Columns_1.COLUMNS.map(toListItem))),
            React.createElement(DialogActions_1.default, null,
                React.createElement(Button_1.default, { onClick: () => setOpen(false), size: "large" }, "Cancel"),
                React.createElement(Button_1.default, { onClick: handleAccept, size: "large", color: "primary", variant: "contained" }, "Apply"))))));
};
//# sourceMappingURL=DocColumnsSelector.js.map