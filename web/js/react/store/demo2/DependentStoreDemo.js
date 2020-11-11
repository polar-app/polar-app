"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependentStoreDemo = void 0;
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const AlphaStoreDemo_1 = require("./AlphaStoreDemo");
const BetaStoreDemo_1 = require("./BetaStoreDemo");
function myCallback() {
    console.log("FIXME it worked");
}
const ChildComponent = () => {
    console.log("FIXME render");
    const alphaStore = AlphaStoreDemo_1.useAlphaStore(undefined);
    const alphaCallbacks = AlphaStoreDemo_1.useAlphaStoreCallbacks();
    const betaStore = BetaStoreDemo_1.useBetaStore(undefined);
    const betaCallbacks = BetaStoreDemo_1.useBetaStoreCallbacks();
    return (react_1.default.createElement("div", null,
        "individual names: ",
        react_1.default.createElement("br", null),
        "alpha: ",
        alphaStore.name,
        " ",
        react_1.default.createElement("br", null),
        "beta: ",
        betaStore.name,
        " ",
        react_1.default.createElement("br", null),
        react_1.default.createElement(Button_1.default, { variant: "contained", onClick: () => alphaCallbacks.setName("alpha-changed") }, "change alpha"),
        react_1.default.createElement(Button_1.default, { variant: "contained", onClick: () => betaCallbacks.setName("beta-changed") }, "change beta"),
        react_1.default.createElement("br", null),
        "names from store perspective: alpha: ",
        react_1.default.createElement("br", null),
        react_1.default.createElement("blockquote", null,
            "alpha: ",
            alphaCallbacks.names().alpha,
            " ",
            react_1.default.createElement("br", null),
            "beta: ",
            alphaCallbacks.names().beta,
            " ",
            react_1.default.createElement("br", null)),
        "beta: ",
        betaStore.name,
        " ",
        react_1.default.createElement("br", null),
        react_1.default.createElement("blockquote", null,
            "alpha: ",
            betaCallbacks.names().alpha,
            " ",
            react_1.default.createElement("br", null),
            "beta: ",
            betaCallbacks.names().beta,
            " ",
            react_1.default.createElement("br", null))));
};
const IntermediateComponent = () => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(ChildComponent, null)));
};
exports.DependentStoreDemo = () => {
    return (react_1.default.createElement(AlphaStoreDemo_1.AlphaStoreProvider, null,
        react_1.default.createElement(BetaStoreDemo_1.BetaStoreProvider, null,
            react_1.default.createElement(IntermediateComponent, null))));
};
//# sourceMappingURL=DependentStoreDemo.js.map