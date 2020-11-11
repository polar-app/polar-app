"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationRepoRoutedComponents = void 0;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const ReactRouters_1 = require("../../../../web/js/react/router/ReactRouters");
const AnnotationRepoGlobalHotKeys_1 = require("./AnnotationRepoGlobalHotKeys");
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const RepoHeader3_1 = require("../repo_header/RepoHeader3");
const AnnotationRepoFilterBar2_1 = require("./AnnotationRepoFilterBar2");
var useLocationWithPathOnly = ReactRouters_1.ReactRouters.useLocationWithPathOnly;
const react_helmet_1 = require("react-helmet");
exports.AnnotationRepoRoutedComponents = react_1.default.memo(() => {
    const location = useLocationWithPathOnly();
    const history = react_router_dom_1.useHistory();
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement(react_router_dom_1.Switch, { location: location },
            react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/annotations' },
                react_1.default.createElement(react_helmet_1.Helmet, null,
                    react_1.default.createElement("title", null, "Polar: Annotation Repository")),
                react_1.default.createElement(DeviceRouter_1.DeviceRouters.Desktop, null,
                    react_1.default.createElement(AnnotationRepoGlobalHotKeys_1.AnnotationRepoGlobalHotKeys, null)),
                react_1.default.createElement(DeviceRouter_1.DeviceRouter.Handheld, null,
                    react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(RepoHeader3_1.RepoHeader.Right, null,
                            react_1.default.createElement(AnnotationRepoFilterBar2_1.AnnotationRepoFilterBar2, null))))))));
});
//# sourceMappingURL=AnnotationRepoRoutedComponents.js.map