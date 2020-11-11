"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoTable2 = exports.useDocRepoContextMenu = exports.DocRepoContextMenu = void 0;
const react_1 = __importDefault(require("react"));
const Table_1 = __importDefault(require("@material-ui/core/Table"));
const TableBody_1 = __importDefault(require("@material-ui/core/TableBody"));
const TableContainer_1 = __importDefault(require("@material-ui/core/TableContainer"));
const DocRepoTableToolbar_1 = require("./DocRepoTableToolbar");
const DocRepoTableHead_1 = require("./DocRepoTableHead");
const DocRepoTableRow_1 = require("./DocRepoTableRow");
const DocRepoStore2_1 = require("./DocRepoStore2");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const MUIElevation_1 = require("../../../../web/js/mui/MUIElevation");
const IntersectionList_1 = require("../../../../web/js/intersection_list/IntersectionList");
const TableRow_1 = __importDefault(require("@material-ui/core/TableRow"));
const Numbers_1 = require("polar-shared/src/util/Numbers");
const Functions_1 = require("polar-shared/src/util/Functions");
const MUIContextMenu2_1 = require("./MUIContextMenu2");
const MUIDocDropdownMenuItems_1 = require("./MUIDocDropdownMenuItems");
const HiddenComponent = react_1.default.memo((props) => {
    const height = HEIGHT;
    return (react_1.default.createElement(TableRow_1.default, { style: {
            minHeight: `${height}px`,
            height: `${height}px`,
        } }));
});
const VisibleComponent = react_1.default.memo((props) => {
    const { selected } = DocRepoStore2_1.useDocRepoStore(['selected']);
    const viewIndex = props.index;
    const row = props.value;
    return (react_1.default.createElement(DocRepoTableRow_1.DocRepoTableRow, { viewIndex: viewIndex, key: viewIndex, rawContextMenuHandler: Functions_1.NULL_FUNCTION, selected: selected.includes(row.id), row: row }));
});
const BlockComponent = react_1.default.memo((props) => {
    const height = Numbers_1.Numbers.sum(...props.values.map(current => HEIGHT));
    return (react_1.default.createElement(TableBody_1.default, { ref: props.innerRef, style: {
            height,
            minHeight: height,
            flexGrow: 1
        } }, props.children));
});
_a = MUIContextMenu2_1.createContextMenu(MUIDocDropdownMenuItems_1.MUIDocDropdownMenuItems), exports.DocRepoContextMenu = _a[0], exports.useDocRepoContextMenu = _a[1];
exports.DocRepoTable2 = ReactUtils_1.deepMemo(() => {
    const { view } = DocRepoStore2_1.useDocRepoStore(['view']);
    const [root, setRoot] = react_1.default.useState();
    return (react_1.default.createElement("div", { style: {
            width: '100%',
            height: '100%'
        } },
        react_1.default.createElement(MUIElevation_1.MUIElevation, { elevation: 2, style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            } },
            react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(DocRepoTableToolbar_1.DocRepoTableToolbar, null),
                react_1.default.createElement(TableContainer_1.default, { ref: setRoot, style: {
                        flexGrow: 1
                    } },
                    react_1.default.createElement(Table_1.default, { stickyHeader: true, style: {
                            minWidth: 0,
                            maxWidth: '100%',
                            tableLayout: 'fixed'
                        }, "aria-labelledby": "tableTitle", size: 'medium', "aria-label": "enhanced table" },
                        react_1.default.createElement(DocRepoTableHead_1.DocRepoTableHead, null),
                        react_1.default.createElement(exports.DocRepoContextMenu, null, root && (react_1.default.createElement(IntersectionList_1.IntersectionList, { values: view, root: root, blockSize: 25, blockComponent: BlockComponent, hiddenComponent: HiddenComponent, visibleComponent: VisibleComponent })))))))));
});
const HEIGHT = 40;
//# sourceMappingURL=DocRepoTable2.js.map