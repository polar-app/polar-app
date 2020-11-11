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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRuntimeRouter = void 0;
const React = __importStar(require("react"));
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
class AppRuntimeRouter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.runtime = AppRuntime_1.AppRuntime.get();
    }
    render() {
        switch (this.runtime) {
            case "electron":
                return this.props.electron || null;
            case "browser":
                return this.props.browser || null;
            default:
                return null;
        }
    }
}
exports.AppRuntimeRouter = AppRuntimeRouter;
AppRuntimeRouter.Electron = (props) => {
    if (AppRuntime_1.AppRuntime.isElectron()) {
        return props.children;
    }
    else {
        return null;
    }
};
AppRuntimeRouter.Browser = (props) => {
    if (AppRuntime_1.AppRuntime.isBrowser()) {
        return props.children;
    }
    else {
        return null;
    }
};
//# sourceMappingURL=AppRuntimeRouter.js.map