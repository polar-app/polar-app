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
exports.PageNumberInput = void 0;
const DocViewerStore_1 = require("../DocViewerStore");
const React = __importStar(require("react"));
const react_1 = require("react");
const TextField_1 = __importDefault(require("@material-ui/core/TextField"));
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
exports.PageNumberInput = ReactUtils_1.deepMemo((props) => {
    const { page, pageNavigator } = DocViewerStore_1.useDocViewerStore(['page', 'pageNavigator']);
    const { onPageJump } = DocViewerStore_1.useDocViewerCallbacks();
    const numberToString = (value) => {
        if (value) {
            return value.toString();
        }
        return '';
    };
    const [state, setState] = react_1.useState({
        changing: false,
        value: ''
    });
    const value = state.changing ?
        state.value :
        numberToString(page);
    const resetState = () => {
        setState({
            changing: false,
            value: ''
        });
    };
    const parsePage = () => {
        try {
            const page = parseInt(value);
            if (page <= 0 || page > (props.nrPages || 0)) {
                return undefined;
            }
            return page;
        }
        catch (e) {
            return undefined;
        }
    };
    const onEnter = () => {
        const newPage = parsePage();
        if (newPage) {
            onPageJump(newPage);
        }
    };
    const handleKeyDown = (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        switch (event.key) {
            case 'Enter':
                onEnter();
                break;
        }
    };
    const handleChange = (val) => {
        setState({ changing: true, value: val });
    };
    const handleBlur = () => {
        resetState();
    };
    return (React.createElement("div", { style: {
            maxWidth: '5em'
        }, className: "mt-auto mb-auto" },
        React.createElement(TextField_1.default, { value: value, onChange: event => handleChange(event.currentTarget.value), disabled: !pageNavigator || pageNavigator.count <= 1, onBlur: () => handleBlur(), onKeyDown: event => handleKeyDown(event), type: "text", size: "small", variant: "outlined", inputProps: {
                style: {
                    textAlign: "right"
                }
            }, style: {
                width: '5em',
            } })));
});
//# sourceMappingURL=PageNumberInput.js.map