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
exports.IntersectionListTableStory = void 0;
const React = __importStar(require("react"));
const Numbers_1 = require("polar-shared/src/util/Numbers");
const IntersectionList_1 = require("../../../web/js/intersection_list/IntersectionList");
const TableBody_1 = __importDefault(require("@material-ui/core/TableBody"));
const TableRow_1 = __importDefault(require("@material-ui/core/TableRow"));
const TableCell_1 = __importDefault(require("@material-ui/core/TableCell"));
const TableHead_1 = __importDefault(require("@material-ui/core/TableHead"));
const Table_1 = __importDefault(require("@material-ui/core/Table"));
const TableContainer_1 = __importDefault(require("@material-ui/core/TableContainer"));
const HEIGHT = 58;
function createData(count) {
    const before = performance.now();
    try {
        function toData(idx) {
            return {
                id: '' + idx,
                idx,
                height: HEIGHT
            };
        }
        return Numbers_1.Numbers.range(1, count).map(toData);
    }
    finally {
        const after = performance.now();
        console.log("createData duration: " + (after - before));
    }
}
const HiddenComponent = React.memo((props) => {
    const height = HEIGHT;
    return (React.createElement(TableRow_1.default, { style: {
            minHeight: `${height}px`,
            height: `${height}px`,
        } }));
});
const VisibleComponent = React.memo((props) => {
    const height = HEIGHT;
    return (React.createElement(TableRow_1.default, { style: {
            minHeight: `${height}px`,
            height: `${height}px`,
        } },
        React.createElement(TableCell_1.default, null, props.index)));
});
const BlockComponent = React.memo((props) => {
    const height = Numbers_1.Numbers.sum(...props.values.map(current => current.height));
    return (React.createElement(TableBody_1.default, { ref: props.innerRef, style: {
            height,
            minHeight: height,
            flexGrow: 1
        } }, props.children));
});
exports.IntersectionListTableStory = () => {
    const data = React.useMemo(() => createData(500), []);
    const [root, setRoot] = React.useState();
    return (React.createElement("div", { ref: setRoot, style: {
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            overflow: 'auto',
            minHeight: 0
        } }, root && (React.createElement(TableContainer_1.default, null,
        React.createElement(Table_1.default, { stickyHeader: true, style: { overflow: 'auto' } },
            React.createElement(TableHead_1.default, null,
                React.createElement(TableRow_1.default, null,
                    React.createElement(TableCell_1.default, null, "id"))),
            React.createElement(IntersectionList_1.IntersectionList, { values: data, root: root, blockComponent: BlockComponent, hiddenComponent: HiddenComponent, visibleComponent: VisibleComponent }))))));
};
//# sourceMappingURL=IntersectionListTableStory.js.map