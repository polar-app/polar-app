"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpandIcon = exports.CollapseIcon = exports.CloseSquare = exports.PlusSquare = exports.MinusSquare = void 0;
const SvgIcon_1 = __importDefault(require("@material-ui/core/SvgIcon"));
const react_1 = __importDefault(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const core_1 = require("@material-ui/core");
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
exports.MinusSquare = (props) => (react_1.default.createElement(SvgIcon_1.default, Object.assign({ fontSize: "inherit", style: { width: '0.7em', height: '0.7em' } }, props),
    react_1.default.createElement("path", { d: "M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" })));
exports.PlusSquare = (props) => (react_1.default.createElement(SvgIcon_1.default, Object.assign({ fontSize: "inherit", style: { width: '0.7em', height: '0.7em' } }, props),
    react_1.default.createElement("path", { d: "M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" })));
exports.CloseSquare = (props) => (react_1.default.createElement(SvgIcon_1.default, Object.assign({ className: "close", fontSize: "inherit", style: { width: '1.0em', height: '1.0em' } }, props),
    react_1.default.createElement("path", { d: "M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" })));
const useStyles = makeStyles_1.default((theme) => core_1.createStyles({
    icon: {
        userSelect: 'none',
        color: theme.palette.text.secondary,
        fontSize: '1.1rem'
    },
}));
exports.CollapseIcon = react_1.default.memo((props) => {
    const classes = useStyles();
    return (react_1.default.createElement(exports.MinusSquare, { className: classes.icon, onClick: () => props.onNodeCollapse(props.nodeId) }));
}, react_fast_compare_1.default);
exports.ExpandIcon = react_1.default.memo((props) => {
    const classes = useStyles();
    return (react_1.default.createElement(exports.PlusSquare, { className: classes.icon, onClick: () => props.onNodeExpand(props.nodeId) }));
}, react_fast_compare_1.default);
//# sourceMappingURL=MUITreeIcons.js.map