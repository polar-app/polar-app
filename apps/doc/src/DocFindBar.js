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
exports.DocFindBar = void 0;
const MUISearchBox2_1 = require("../../../web/js/mui/MUISearchBox2");
const React = __importStar(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const MUIPaperToolbar_1 = require("../../../web/js/mui/MUIPaperToolbar");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const ArrowUpward_1 = __importDefault(require("@material-ui/icons/ArrowUpward"));
const ArrowDownward_1 = __importDefault(require("@material-ui/icons/ArrowDownward"));
const MUIButtonBar_1 = require("../../../web/js/mui/MUIButtonBar");
const Close_1 = __importDefault(require("@material-ui/icons/Close"));
const InputEscapeListener_1 = require("../../../web/js/mui/complete_listeners/InputEscapeListener");
const DocFindStore_1 = require("./DocFindStore");
const Collapse_1 = __importDefault(require("@material-ui/core/Collapse/Collapse"));
function useFindCallback() {
    const { findHandler } = DocFindStore_1.useDocFindStore(['findHandler']);
    const { doFind, setOpts, reset } = DocFindStore_1.useDocFindCallbacks();
    return React.useCallback((opts) => {
        const { query } = opts;
        setOpts(opts);
        if (query.trim() === '') {
            reset(true);
            return;
        }
        if (findHandler && react_fast_compare_1.default(opts, findHandler.opts)) {
            findHandler.next();
            return;
        }
        doFind(opts);
    }, [doFind, findHandler, reset, setOpts]);
}
const Matches = React.memo(() => {
    const { matches } = DocFindStore_1.useDocFindStore(['matches']);
    if (!matches) {
        return null;
    }
    return (React.createElement("div", { style: { userSelect: 'none' } },
        matches.current,
        " of ",
        matches.total));
}, react_fast_compare_1.default);
const MatchNav = React.memo(() => {
    const { matches } = DocFindStore_1.useDocFindStore(['matches']);
    const { findHandler } = DocFindStore_1.useDocFindStore(['findHandler']);
    return (React.createElement(React.Fragment, null,
        React.createElement(IconButton_1.default, { disabled: !matches || matches.current === 1, onClick: () => findHandler.prev() },
            React.createElement(ArrowUpward_1.default, null)),
        React.createElement(IconButton_1.default, { disabled: !matches || matches.current === matches.total, onClick: () => findHandler.next() },
            React.createElement(ArrowDownward_1.default, null))));
}, react_fast_compare_1.default);
exports.DocFindBar = React.memo(() => {
    const { active, opts } = DocFindStore_1.useDocFindStore(['active', 'opts']);
    const { reset, setMatches } = DocFindStore_1.useDocFindCallbacks();
    const doFind = useFindCallback();
    const cancelFind = React.useCallback(() => {
        reset();
    }, [reset]);
    const handleFind = React.useCallback((query) => {
        const newOpts = Object.assign(Object.assign({}, opts), { query, onMatches: setMatches });
        doFind(newOpts);
    }, [doFind, setMatches, opts]);
    return (React.createElement(Collapse_1.default, { in: active, timeout: 50 }, active &&
        React.createElement(InputEscapeListener_1.InputEscapeListener, { onEscape: cancelFind },
            React.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { borderBottom: true },
                React.createElement("div", { style: {
                        display: 'flex',
                        alignItems: "center",
                    }, className: "pl-1 pr-1" },
                    React.createElement(MUIButtonBar_1.MUIButtonBar, null,
                        React.createElement(MUISearchBox2_1.MUISearchBox2, { className: "mt-1 mb-1", onChange: handleFind, autoFocus: true, value: opts.query, autoComplete: "off", style: {
                                width: '20em'
                            }, placeholder: "Search..." }),
                        React.createElement(MatchNav, null),
                        React.createElement(Matches, null)),
                    React.createElement("div", { style: {
                            display: 'flex',
                            alignItems: "center",
                            justifyContent: 'flex-end',
                            flexGrow: 1
                        } },
                        React.createElement(IconButton_1.default, { onClick: cancelFind },
                            React.createElement(Close_1.default, null))))))));
});
//# sourceMappingURL=DocFindBar.js.map