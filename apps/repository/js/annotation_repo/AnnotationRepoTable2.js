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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationRepoTable2 = exports.useAnnotationRepoTableContextMenu = exports.AnnotationRepoTableContextMenu = void 0;
const React = __importStar(require("react"));
const TableContainer_1 = __importDefault(require("@material-ui/core/TableContainer"));
const Table_1 = __importDefault(require("@material-ui/core/Table"));
const TableBody_1 = __importDefault(require("@material-ui/core/TableBody"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const TablePagination_1 = __importDefault(require("@material-ui/core/TablePagination"));
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const AnnotationRepoStore_1 = require("./AnnotationRepoStore");
const AnnotationRepoTableRow_1 = require("./AnnotationRepoTableRow");
const MUIContextMenu2_1 = require("../doc_repo/MUIContextMenu2");
const AnnotationRepoTableMenu_1 = require("./AnnotationRepoTableMenu");
const MUINextIconButton_1 = require("../../../../web/js/mui/icon_buttons/MUINextIconButton");
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const MUIPrevIconButton_1 = require("../../../../web/js/mui/icon_buttons/MUIPrevIconButton");
const Toolbar = React.memo((props) => {
    const handleChangePage = (event, newPage) => {
        props.onChangePage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        props.onChangeRowsPerPage(rowsPerPage);
    };
    return (React.createElement(DeviceRouter_1.DeviceRouter.Desktop, null,
        React.createElement(React.Fragment, null,
            React.createElement(TablePagination_1.default, { rowsPerPageOptions: [5, 10, 25, 50], component: "div", size: "small", count: props.nrRows, rowsPerPage: props.rowsPerPage, style: {
                    padding: 0,
                    overflow: "hidden",
                    minHeight: '4.5em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                }, page: props.page, onChangePage: handleChangePage, onChangeRowsPerPage: handleChangeRowsPerPage }),
            React.createElement(Divider_1.default, { orientation: "horizontal" }))));
}, react_fast_compare_1.default);
var Handheld;
(function (Handheld) {
    Handheld.PrevPage = React.memo(() => {
        const { page } = AnnotationRepoStore_1.useAnnotationRepoStore(['page']);
        const { setPage } = AnnotationRepoStore_1.useAnnotationRepoCallbacks();
        if (page <= 0) {
            return null;
        }
        return (React.createElement(DeviceRouter_1.DeviceRouters.Handheld, null,
            React.createElement(MUIPrevIconButton_1.MUIPrevIconButton, { color: 'secondary', onClick: () => setPage(page - 1) })));
    });
    Handheld.NextPage = React.memo(() => {
        const { page, rowsPerPage, view } = AnnotationRepoStore_1.useAnnotationRepoStore(['page', 'rowsPerPage', 'view']);
        const { setPage } = AnnotationRepoStore_1.useAnnotationRepoCallbacks();
        const nrPages = view.length / rowsPerPage;
        if (page === nrPages) {
            return null;
        }
        return (React.createElement(DeviceRouter_1.DeviceRouters.Handheld, null,
            React.createElement(MUINextIconButton_1.MUINextIconButton, { color: 'secondary', onClick: () => setPage(page + 1) })));
    });
})(Handheld || (Handheld = {}));
_a = MUIContextMenu2_1.createContextMenu(AnnotationRepoTableMenu_1.AnnotationRepoTableMenu), exports.AnnotationRepoTableContextMenu = _a[0], exports.useAnnotationRepoTableContextMenu = _a[1];
exports.AnnotationRepoTable2 = React.memo(() => {
    const { page, rowsPerPage, view, viewPage, selected } = AnnotationRepoStore_1.useAnnotationRepoStore(['page', 'rowsPerPage', 'view', 'viewPage', 'selected']);
    const { setPage, setRowsPerPage } = AnnotationRepoStore_1.useAnnotationRepoCallbacks();
    return (React.createElement(exports.AnnotationRepoTableContextMenu, null,
        React.createElement(Paper_1.default, { className: "AnnotationRepoTable2", square: true, id: "doc-repo-table", elevation: 0, style: {
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                flexGrow: 1
            } },
            React.createElement(Toolbar, { nrRows: view.length, rowsPerPage: rowsPerPage, page: page, onChangePage: setPage, onChangeRowsPerPage: setRowsPerPage }),
            React.createElement("div", { id: "doc-table", className: "AnnotationRepoTable2.Body", style: {
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                    flexGrow: 1,
                    overflow: 'auto'
                } },
                React.createElement(Handheld.PrevPage, null),
                React.createElement(TableContainer_1.default, { style: {
                        flexGrow: 1,
                        overflow: 'auto'
                    } },
                    React.createElement(Table_1.default, { stickyHeader: true, style: {
                            minWidth: 0,
                            maxWidth: '100%',
                            tableLayout: 'fixed'
                        }, "aria-labelledby": "tableTitle", size: 'medium', "aria-label": "enhanced table" },
                        React.createElement(TableBody_1.default, null, viewPage.map((annotation, index) => {
                            const viewIndex = (page * rowsPerPage) + index;
                            const rowSelected = selected.includes(annotation.id);
                            return (React.createElement(AnnotationRepoTableRow_1.AnnotationRepoTableRow, { key: annotation.id, viewIndex: viewIndex, rowSelected: rowSelected, annotation: annotation }));
                        })))),
                React.createElement(Handheld.NextPage, null)))));
});
//# sourceMappingURL=AnnotationRepoTable2.js.map