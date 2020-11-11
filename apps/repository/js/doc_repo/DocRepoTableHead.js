"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoTableHead = void 0;
const react_1 = __importDefault(require("react"));
const TableHead_1 = __importDefault(require("@material-ui/core/TableHead"));
const TableRow_1 = __importDefault(require("@material-ui/core/TableRow"));
const TableCell_1 = __importDefault(require("@material-ui/core/TableCell"));
const TableSortLabel_1 = __importDefault(require("@material-ui/core/TableSortLabel"));
const styles_1 = require("@material-ui/core/styles");
const Columns_1 = require("./Columns");
const Sorting_1 = require("./Sorting");
const DocRepoStore2_1 = require("./DocRepoStore2");
const DocRepoColumnsPrefsHook_1 = require("./DocRepoColumnsPrefsHook");
const DocColumnsSelectorWithPrefs_1 = require("./DocColumnsSelectorWithPrefs");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    root: {
        backgroundColor: theme.palette.background.default
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    th: {
        whiteSpace: 'nowrap',
    },
    row: {
        "& th": {
            paddingTop: '3px',
            paddingBottom: '3px',
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: `${theme.palette.background.default} !important`
        }
    }
}));
function DocRepoTableHead() {
    const classes = useStyles();
    const { order, orderBy } = DocRepoStore2_1.useDocRepoStore(['order', 'orderBy']);
    const { setSort } = DocRepoStore2_1.useDocRepoCallbacks();
    const selectedColumns = DocRepoColumnsPrefsHook_1.useDocRepoColumnsPrefs();
    const columns = selectedColumns.map(current => Columns_1.COLUMN_MAP[current])
        .filter(current => Preconditions_1.isPresent(current));
    return (react_1.default.createElement(TableHead_1.default, { className: classes.root },
        react_1.default.createElement(TableRow_1.default, { className: classes.row },
            react_1.default.createElement(TableCell_1.default, { key: "left-checkbox", padding: "checkbox" }),
            columns.map((column) => {
                const newOrder = orderBy === column.id ? Sorting_1.Sorting.reverse(order) : column.defaultOrder;
                return (react_1.default.createElement(TableCell_1.default, { key: column.id, className: classes.th, style: {
                        width: column.width,
                        minWidth: column.width
                    }, padding: column.disablePadding ? 'none' : 'default', sortDirection: orderBy === column.id ? order : false },
                    react_1.default.createElement(TableSortLabel_1.default, { active: orderBy === column.id, direction: order, onClick: () => setSort(newOrder, column.id) },
                        column.label,
                        orderBy === column.id ? (react_1.default.createElement("span", { className: classes.visuallyHidden }, order === 'desc' ? 'sorted descending' : 'sorted ascending')) : null)));
            }),
            react_1.default.createElement(TableCell_1.default, { key: "right-filter", style: {
                    width: Columns_1.DOC_BUTTON_COLUMN_WIDTH,
                } },
                react_1.default.createElement("div", { style: { display: 'flex', justifyContent: 'flex-end' } },
                    react_1.default.createElement(DocColumnsSelectorWithPrefs_1.DocColumnsSelectorWithPrefs, null))))));
}
exports.DocRepoTableHead = DocRepoTableHead;
//# sourceMappingURL=DocRepoTableHead.js.map