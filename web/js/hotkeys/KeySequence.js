"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySequence = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../react/ReactUtils");
const grey_1 = __importDefault(require("@material-ui/core/colors/grey"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    root: {
        fontFamily: 'monospace',
        fontSize: '1.1em',
        padding: '5px',
        borderRadius: '2px',
        border: `1px solid ${grey_1.default[500]}`,
        backgroundColor: grey_1.default[200],
        color: grey_1.default[900],
        margin: '5px',
        whiteSpace: 'nowrap',
        userSelect: 'none'
    },
}));
exports.KeySequence = ReactUtils_1.deepMemo((props) => {
    const classes = useStyles();
    function prettyPrintSequence() {
        let result = props.sequence;
        if (result === ' ') {
            result = 'space';
        }
        return result.split('+').join(' + ');
    }
    const sequence = prettyPrintSequence();
    return (react_1.default.createElement("div", { className: classes.root }, sequence));
});
//# sourceMappingURL=KeySequence.js.map