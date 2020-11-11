"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoScreenRoutedComponents = void 0;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const ReactRouters_1 = require("../../../../web/js/react/router/ReactRouters");
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const RepoHeader3_1 = require("../repo_header/RepoHeader3");
const DocRepoFilterBar_1 = require("./DocRepoFilterBar");
const DocRepoGlobalHotKeys_1 = require("./DocRepoGlobalHotKeys");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const Menu_1 = __importDefault(require("@material-ui/icons/Menu"));
var useLocationWithPathOnly = ReactRouters_1.ReactRouters.useLocationWithPathOnly;
const react_helmet_1 = require("react-helmet");
exports.DocRepoScreenRoutedComponents = react_1.default.memo(() => {
    const location = useLocationWithPathOnly();
    const history = react_router_dom_1.useHistory();
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement(react_router_dom_1.Switch, { location: location },
            react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: '/' },
                react_1.default.createElement(react_helmet_1.Helmet, null,
                    react_1.default.createElement("title", null, "Polar: Document Repository")),
                react_1.default.createElement(DeviceRouter_1.DeviceRouters.Desktop, null,
                    react_1.default.createElement(DocRepoGlobalHotKeys_1.DocRepoGlobalHotKeys, null)),
                react_1.default.createElement(DeviceRouter_1.DeviceRouter.Handheld, null,
                    react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(RepoHeader3_1.RepoHeader.LeftMenu, null,
                            react_1.default.createElement(IconButton_1.default, { onClick: () => history.push({ hash: "#folders" }) },
                                react_1.default.createElement(Menu_1.default, null))),
                        react_1.default.createElement(RepoHeader3_1.RepoHeader.Right, null,
                            react_1.default.createElement(DocRepoFilterBar_1.DocRepoFilterBar, null))))))));
});
//# sourceMappingURL=DocRepoScreenRoutedComponents.js.map