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
exports.ObservableStoreDemo = void 0;
const react_1 = __importStar(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const TagStoreDemo_1 = require("./TagStoreDemo");
const MyInvitationStoreDemo_1 = require("./MyInvitationStoreDemo");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class LegacyComponent extends react_1.default.Component {
    componentWillUnmount() {
    }
    render() {
        return react_1.default.createElement("div", null, "legacy unmountable component");
    }
}
const ToggleMounted = (props) => {
    const [mounted, setMounted] = react_1.useState(true);
    return (react_1.default.createElement("div", null,
        mounted && react_1.default.createElement("div", null,
            react_1.default.createElement(LegacyComponent, null),
            props.children),
        react_1.default.createElement(Button_1.default, { variant: "contained", onClick: () => setMounted(!mounted) }, "toggle mounted")));
};
function useMyHook() {
    const tagStore = TagStoreDemo_1.useTagStore(undefined);
    console.log("FIXME: got my tagStore: ", tagStore);
}
function myCallback() {
    console.log("FIXME it worked");
}
const myCallbacks = {
    myCallback
};
const ChildComponent = () => {
    const store = MyInvitationStoreDemo_1.useMyInvitationStore(undefined);
    const callbacks = MyInvitationStoreDemo_1.useMyInvitationStoreCallbacks();
    Preconditions_1.Preconditions.assertPresent(callbacks, "callbacks");
    return (react_1.default.createElement(ToggleMounted, null,
        react_1.default.createElement("div", null,
            react_1.default.createElement("div", null,
                "child component: ",
                store.invited ? 'true' : 'false'),
            react_1.default.createElement(Button_1.default, { variant: "contained", onClick: callbacks.toggleInvited }, "toggle"))));
};
const IntermediateComponent = () => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(ChildComponent, null),
        react_1.default.createElement(ChildComponent, null)));
};
exports.ObservableStoreDemo = () => {
    return (react_1.default.createElement(TagStoreDemo_1.TagStoreProvider, null,
        react_1.default.createElement(MyInvitationStoreDemo_1.MyInvitationStoreProvider, null,
            react_1.default.createElement(IntermediateComponent, null))));
};
//# sourceMappingURL=ObservableStoreDemo.js.map