"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoScreen2 = void 0;
const react_1 = __importDefault(require("react"));
const FixedNav_1 = require("../FixedNav");
const MUIPaperToolbar_1 = require("../../../../web/js/mui/MUIPaperToolbar");
const DocRepoButtonBar_1 = require("./DocRepoButtonBar");
const DocRepoFilterBar_1 = require("./DocRepoFilterBar");
const DocRepoTable2_1 = require("./DocRepoTable2");
const react_router_1 = require("react-router");
const ReactRouters_1 = require("../../../../web/js/react/router/ReactRouters");
const LeftSidebar_1 = require("../../../../web/js/ui/motion/LeftSidebar");
const DockLayout_1 = require("../../../../web/js/ui/doc_layout/DockLayout");
const FolderSidebar2_1 = require("../folders/FolderSidebar2");
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const AddContentButton_1 = require("../ui/AddContentButton");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const DocRepoScreenRoutedComponents_1 = require("./DocRepoScreenRoutedComponents");
const react_router_dom_1 = require("react-router-dom");
var useLocationWithHashOnly = ReactRouters_1.ReactRouters.useLocationWithHashOnly;
const SwipeableDrawer_1 = __importDefault(require("@material-ui/core/SwipeableDrawer"));
const FeedbackButton2_1 = require("../ui/FeedbackButton2");
var main;
(function (main) {
    main.Documents = react_1.default.memo(() => (react_1.default.createElement(DocRepoTable2_1.DocRepoTable2, null)));
    main.Folders = react_1.default.memo(() => (react_1.default.createElement(FolderSidebar2_1.FolderSidebar2, null)));
})(main || (main = {}));
const onClose = () => window.history.back();
const Router = () => (react_1.default.createElement(react_router_1.Switch, { location: ReactRouters_1.ReactRouters.createLocationWithHashOnly() },
    react_1.default.createElement(react_router_1.Route, { path: '#folders' },
        react_1.default.createElement(LeftSidebar_1.LeftSidebar, { onClose: onClose },
            react_1.default.createElement(main.Folders, null)))));
const FolderDrawer = react_1.default.memo(() => {
    const location = useLocationWithHashOnly();
    const history = react_router_dom_1.useHistory();
    const open = location.hash === '#folders';
    function handleClose() {
        history.replace({ hash: '' });
    }
    function handleOpen() {
        history.push({ hash: '#folders' });
    }
    return (react_1.default.createElement(SwipeableDrawer_1.default, { anchor: 'left', open: open, onClose: handleClose, onOpen: handleOpen },
        react_1.default.createElement(main.Folders, null)));
});
var devices;
(function (devices) {
    devices.PhoneAndTablet = react_1.default.memo(() => (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(FolderDrawer, null),
        react_1.default.createElement(main.Documents, null))));
    devices.Desktop = react_1.default.memo(() => (react_1.default.createElement(DockLayout_1.DockLayout, { dockPanels: [
            {
                id: "dock-panel-left",
                type: 'fixed',
                component: react_1.default.createElement(FolderSidebar2_1.FolderSidebar2, null),
                width: 300,
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    overflow: 'none'
                }
            },
            {
                id: "doc-panel-center",
                type: 'grow',
                component: react_1.default.createElement(main.Documents, null)
            }
        ] })));
})(devices || (devices = {}));
const DesktopToolbar = () => {
    return (react_1.default.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { id: "header-filter", borderBottom: true, padding: 1 },
        react_1.default.createElement("div", { style: {
                display: 'flex',
                alignItems: 'center'
            } },
            react_1.default.createElement("div", { className: "", style: {
                    whiteSpace: 'nowrap',
                    display: 'flex'
                } },
                react_1.default.createElement(DocRepoButtonBar_1.DocRepoButtonBar, null)),
            react_1.default.createElement("div", { style: { marginLeft: 'auto' } },
                react_1.default.createElement(DocRepoFilterBar_1.DocRepoFilterBar, null)))));
};
exports.DocRepoScreen2 = react_1.default.memo(() => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(FixedNav_1.FixedNav, { id: "doc-repository" },
            react_1.default.createElement(DocRepoScreenRoutedComponents_1.DocRepoScreenRoutedComponents, null),
            react_1.default.createElement("header", null,
                react_1.default.createElement(DeviceRouter_1.DeviceRouters.Desktop, null,
                    react_1.default.createElement(DesktopToolbar, null))),
            react_1.default.createElement(DeviceRouter_1.DeviceRouter, { handheld: react_1.default.createElement(devices.PhoneAndTablet, null), desktop: react_1.default.createElement(devices.Desktop, null) }),
            react_1.default.createElement(FixedNav_1.FixedNav.Footer, null,
                react_1.default.createElement(DeviceRouter_1.DeviceRouter.Handheld, null,
                    react_1.default.createElement(AddContentButton_1.AddContent.Handheld, null)),
                react_1.default.createElement(FeedbackButton2_1.FeedbackButton2, null)))));
}, react_fast_compare_1.default);
//# sourceMappingURL=DocRepoScreen2.js.map