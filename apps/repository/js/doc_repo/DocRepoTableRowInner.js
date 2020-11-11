"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoTableRowInner = exports.TableCellTags = void 0;
const react_1 = __importDefault(require("react"));
const TableCell_1 = __importDefault(require("@material-ui/core/TableCell"));
const DateTimeTableCell_1 = require("../DateTimeTableCell");
const MUIDocButtonBar_1 = require("./MUIDocButtonBar");
const styles_1 = require("@material-ui/core/styles");
const Columns_1 = require("./Columns");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Tags_1 = require("polar-shared/src/tags/Tags");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const DocRepoStore2_1 = require("./DocRepoStore2");
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const DocRepoColumnsPrefsHook_1 = require("./DocRepoColumnsPrefsHook");
const MUIHoverStore_1 = require("../../../../web/js/mui/MUIHoverStore");
const StandardIconButton_1 = require("./buttons/StandardIconButton");
const DocRepoTable2_1 = require("./DocRepoTable2");
const MoreVert_1 = __importDefault(require("@material-ui/icons/MoreVert"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
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
    progress: {
        width: Columns_1.COLUMN_MAP.progress.width
    },
    colProgress: {
        width: Columns_1.COLUMN_MAP.progress.width,
        minWidth: Columns_1.COLUMN_MAP.progress.width
    },
    colAdded: {
        whiteSpace: 'nowrap',
        width: Columns_1.COLUMN_MAP.added.width,
    },
    colLastUpdated: {
        whiteSpace: 'nowrap',
        width: Columns_1.COLUMN_MAP.lastUpdated.width,
    },
    colTitle: {
        width: Columns_1.COLUMN_MAP.title.width,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        textOverflow: 'ellipsis'
    },
    colTags: {
        width: Columns_1.COLUMN_MAP.tags.width,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        textOverflow: 'ellipsis'
    },
    colAuthors: {
        width: Columns_1.COLUMN_MAP.authors.width,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        textOverflow: 'ellipsis'
    },
    colDocButtons: {
        width: Columns_1.DOC_BUTTON_COLUMN_WIDTH,
    },
    docButtons: {
        display: 'flex',
        justifyContent: 'center'
    }
}));
exports.TableCellTags = react_1.default.memo((props) => {
    const classes = useStyles();
    return (react_1.default.createElement(TableCell_1.default, { padding: "none", className: classes.colTags, onClick: event => props.selectRow(props.viewID, event, 'click'), onContextMenu: props.contextMenuHandler }, ArrayStreams_1.arrayStream(Tags_1.Tags.onlyRegular(Object.values(props.tags || {})))
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(current => current.label)
        .collect()
        .join(', ')));
}, react_fast_compare_1.default);
exports.DocRepoTableRowInner = react_1.default.memo((props) => {
    const classes = useStyles();
    const callbacks = DocRepoStore2_1.useDocRepoCallbacks();
    const { selectRow } = callbacks;
    const { viewIndex, rawContextMenuHandler, row } = props;
    const contextMenuHandler = react_1.default.useCallback((event) => {
        selectRow(row.id, event, 'context');
        rawContextMenuHandler(event);
    }, [selectRow, row.id, rawContextMenuHandler]);
    const selectRowClickHandler = react_1.default.useCallback((event) => {
        selectRow(row.id, event, 'click');
    }, [row.id, selectRow]);
    const labelId = `enhanced-table-checkbox-${viewIndex}`;
    const columns = DocRepoColumnsPrefsHook_1.useDocRepoColumnsPrefs();
    const toCell = react_1.default.useCallback((id) => {
        switch (id) {
            case 'title':
                return (react_1.default.createElement(TableCell_1.default, { key: id, component: "th", id: labelId, scope: "row", className: classes.colTitle, padding: "none", onClick: selectRowClickHandler, onContextMenu: contextMenuHandler }, row.title));
            case 'added':
                return (react_1.default.createElement(DeviceRouter_1.DeviceRouters.NotPhone, { key: id },
                    react_1.default.createElement(TableCell_1.default, { className: classes.colAdded, padding: "none", onClick: selectRowClickHandler, onContextMenu: contextMenuHandler },
                        react_1.default.createElement(DateTimeTableCell_1.DateTimeTableCell, { datetime: row.added }))));
            case 'lastUpdated':
                return (react_1.default.createElement(DeviceRouter_1.DeviceRouters.NotPhone, { key: id },
                    react_1.default.createElement(TableCell_1.default, { className: classes.colLastUpdated, padding: "none", onClick: selectRowClickHandler, onContextMenu: contextMenuHandler },
                        react_1.default.createElement(DateTimeTableCell_1.DateTimeTableCell, { datetime: row.lastUpdated }))));
            case 'tags':
                return (react_1.default.createElement(DeviceRouter_1.DeviceRouters.NotPhone, { key: id },
                    react_1.default.createElement(exports.TableCellTags, { contextMenuHandler: contextMenuHandler, selectRow: selectRow, viewID: row.id, tags: row.tags })));
            case 'authors':
                return (react_1.default.createElement(DeviceRouter_1.DeviceRouters.NotPhone, { key: id },
                    react_1.default.createElement(TableCell_1.default, { padding: "none", className: classes.colAuthors, onClick: selectRowClickHandler, onContextMenu: contextMenuHandler }, Object.values(row.docInfo.authors || {}).join(', '))));
            case 'progress':
                return (react_1.default.createElement(cells.Progress, { key: id, viewID: row.id, flagged: row.flagged, archived: row.archived, progress: row.progress, selectRowClickHandler: selectRowClickHandler, contextMenuHandler: contextMenuHandler }));
            default:
                return (react_1.default.createElement(DeviceRouter_1.DeviceRouters.NotPhone, { key: id },
                    react_1.default.createElement(TableCell_1.default, { className: classes.colProgress, onClick: selectRowClickHandler, onContextMenu: contextMenuHandler, padding: "none", style: {
                            width: Columns_1.COLUMN_MAP[id].width,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        } }, row.docInfo[id])));
        }
    }, [classes, contextMenuHandler, labelId, row, selectRow, selectRowClickHandler]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        columns.map(toCell),
        react_1.default.createElement(DeviceRouter_1.DeviceRouters.NotPhone, null,
            react_1.default.createElement(TableCell_1.default, { align: "right", padding: "none", className: classes.colDocButtons, onClick: event => event.stopPropagation(), onDoubleClick: event => event.stopPropagation() },
                react_1.default.createElement(cells.OverflowMenuButton, { viewID: row.id })))));
}, react_fast_compare_1.default);
var cells;
(function (cells) {
    cells.Progress = react_1.default.memo((props) => {
        const { viewID, flagged, archived } = props;
        const classes = useStyles();
        const hoverActive = MUIHoverStore_1.useMUIHoverActive();
        const Progress = react_1.default.memo(() => (react_1.default.createElement("progress", { className: classes.progress, value: props.progress, max: 100 })));
        const Buttons = react_1.default.memo(() => (react_1.default.createElement(MUIDocButtonBar_1.MUIDocButtonBar, { className: classes.docButtons, flagged: flagged, archived: archived, viewID: viewID })));
        return (react_1.default.createElement(DeviceRouter_1.DeviceRouters.NotPhone, null,
            react_1.default.createElement(TableCell_1.default, { className: classes.colProgress, onClick: props.selectRowClickHandler, onContextMenu: props.contextMenuHandler, padding: "none" },
                hoverActive && react_1.default.createElement(Buttons, null),
                !hoverActive && react_1.default.createElement(Progress, null))));
    });
    cells.OverflowMenuButton = react_1.default.memo((props) => {
        const { viewID } = props;
        const { selectRow } = DocRepoStore2_1.useDocRepoCallbacks();
        const contextMenuHandlers = DocRepoTable2_1.useDocRepoContextMenu();
        const handleDropdownMenu = react_1.default.useCallback((event) => {
            selectRow(viewID, event, 'click');
            contextMenuHandlers.onContextMenu(event);
        }, [contextMenuHandlers, selectRow, viewID]);
        return (react_1.default.createElement(Box_1.default, { mr: 1 },
            react_1.default.createElement(StandardIconButton_1.StandardIconButton, { tooltip: "More document actions...", "aria-controls": "doc-dropdown-menu", "aria-haspopup": "true", onClick: handleDropdownMenu, size: "small" },
                react_1.default.createElement(MoreVert_1.default, null))));
    });
})(cells || (cells = {}));
//# sourceMappingURL=DocRepoTableRowInner.js.map