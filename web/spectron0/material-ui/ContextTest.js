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
exports.ContextMemoTest = void 0;
const react_1 = __importStar(require("react"));
const ContextMemo_1 = require("../../js/react/ContextMemo");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const initialAcceptedInvitations = {
    alice: true,
    bob: true,
    carol: true
};
const AcceptedInvitationsContext = ContextMemo_1.createContextMemo(initialAcceptedInvitations);
const LeafComponent = () => {
    console.log("LeafComponent: rendered");
    const acceptedInvitations = ContextMemo_1.useContextMemo(AcceptedInvitationsContext);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("br", null),
        "alice ",
        acceptedInvitations.alice ? 'true' : 'false',
        react_1.default.createElement("br", null),
        "bob ",
        acceptedInvitations.bob ? 'true' : 'false',
        react_1.default.createElement("br", null),
        "carol ",
        acceptedInvitations.carol ? 'true' : 'false',
        react_1.default.createElement("br", null)));
};
const IntermediateComponent = react_1.default.memo(() => {
    console.log("IntermediateComponent: rendered");
    return react_1.default.createElement(LeafComponent, null);
}, react_fast_compare_1.default);
const RootComponent = () => {
    const [iter, setIter] = react_1.useState(1);
    const [acceptedInvitations, setAcceptedInvitations] = react_1.useState(initialAcceptedInvitations);
    const toggleAlice = () => setAcceptedInvitations(Object.assign(Object.assign({}, acceptedInvitations), { alice: !acceptedInvitations.alice }));
    const toggleBob = () => setAcceptedInvitations(Object.assign(Object.assign({}, acceptedInvitations), { bob: !acceptedInvitations.bob }));
    const toggleCarol = () => setAcceptedInvitations(Object.assign(Object.assign({}, acceptedInvitations), { carol: !acceptedInvitations.carol }));
    return (react_1.default.createElement(AcceptedInvitationsContext.Provider, { value: acceptedInvitations },
        react_1.default.createElement("div", null,
            "iter: ",
            iter,
            " ",
            react_1.default.createElement("br", null),
            react_1.default.createElement(Button_1.default, { variant: "contained", onClick: () => setIter(iter + 1) }, "increase iter"),
            react_1.default.createElement(Button_1.default, { variant: "contained", onClick: toggleAlice }, "toggle alice"),
            react_1.default.createElement(Button_1.default, { variant: "contained", onClick: toggleBob }, "toggle bob"),
            react_1.default.createElement(Button_1.default, { variant: "contained", onClick: toggleCarol }, "toggle carol"),
            react_1.default.createElement(IntermediateComponent, null))));
};
exports.ContextMemoTest = () => {
    return (react_1.default.createElement(RootComponent, null));
};
//# sourceMappingURL=ContextTest.js.map