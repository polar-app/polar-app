"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIErrorBoundary = void 0;
const react_1 = __importDefault(require("react"));
const ConfirmDialog_1 = require("../../ui/dialogs/ConfirmDialog");
const Functions_1 = require("polar-shared/src/util/Functions");
const ErrorDialog = (props) => {
    const Subtitle = () => (react_1.default.createElement("div", null,
        react_1.default.createElement("p", null,
            react_1.default.createElement("b", null, "We detected an unhandled error: ")),
        react_1.default.createElement("pre", null, props.stack)));
    return (react_1.default.createElement(ConfirmDialog_1.ConfirmDialog, { type: 'danger', title: "Unhandled error", noCancel: true, subtitle: react_1.default.createElement(Subtitle, null), onCancel: Functions_1.NULL_FUNCTION, onAccept: props.onAccept }));
};
class MUIErrorBoundary extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = { err: undefined };
    }
    componentDidCatch(error, info) {
        this.setState({ err: { error, info } });
        console.log("Caught error at React error boundary: ", error, info.componentStack);
    }
    render() {
        if (this.state.err) {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(ErrorDialog, { stack: this.state.err.info.componentStack, onAccept: () => this.setState({ err: undefined }) }),
                this.props.children));
        }
        return this.props.children;
    }
}
exports.MUIErrorBoundary = MUIErrorBoundary;
//# sourceMappingURL=MUIErrorBoundary.js.map