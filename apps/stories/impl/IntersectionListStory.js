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
exports.IntersectionListStory = void 0;
const React = __importStar(require("react"));
const Numbers_1 = require("polar-shared/src/util/Numbers");
const IntersectionList_1 = require("../../../web/js/intersection_list/IntersectionList");
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
function createData(count) {
    const before = performance.now();
    try {
        function toData(idx) {
            return {
                id: '' + idx,
                idx,
                height: Math.floor((Math.random() * 50) + 55)
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
    return (React.createElement("div", { style: {
            minHeight: `${props.value.height}px`,
            height: `${props.value.height}px`
        } }));
});
const VisibleComponent = React.memo((props) => {
    const theme = useTheme_1.default();
    const background = props.value.idx % 2 === 0 ? theme.palette.background.paper : theme.palette.background.default;
    return (React.createElement("div", { style: {
            minHeight: `${props.value.height}px`,
            height: `${props.value.height}px`,
            background
        } },
        React.createElement("div", null,
            "id: ",
            props.value.id,
            " ",
            React.createElement("br", null),
            "height: ",
            props.value.height)));
});
const BlockComponent = React.memo((props) => {
    const height = Numbers_1.Numbers.sum(...props.values.map(current => current.height));
    return (React.createElement("div", { ref: props.innerRef, style: {
            height,
            minHeight: height,
            overflow: 'auto',
            flexGrow: 1
        } }, props.children));
});
exports.IntersectionListStory = () => {
    const data = React.useMemo(() => createData(500), []);
    const [root, setRoot] = React.useState();
    return (React.createElement("div", { ref: setRoot, style: {
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            overflow: 'auto'
        } }, root && (React.createElement(IntersectionList_1.IntersectionList, { values: data, root: root, blockComponent: BlockComponent, hiddenComponent: HiddenComponent, visibleComponent: VisibleComponent }))));
};
//# sourceMappingURL=IntersectionListStory.js.map