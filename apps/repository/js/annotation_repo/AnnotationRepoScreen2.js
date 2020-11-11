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
exports.AnnotationRepoScreen2 = void 0;
const React = __importStar(require("react"));
const FixedNav_1 = require("../FixedNav");
const RepoFooter_1 = require("../repo_footer/RepoFooter");
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const DockLayout_1 = require("../../../../web/js/ui/doc_layout/DockLayout");
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const MUIPaperToolbar_1 = require("../../../../web/js/mui/MUIPaperToolbar");
const FolderSidebar2_1 = require("../folders/FolderSidebar2");
const AnnotationListView2_1 = require("./AnnotationListView2");
const AnnotationRepoFilterBar2_1 = require("./AnnotationRepoFilterBar2");
const AnnotationRepoTable2_1 = require("./AnnotationRepoTable2");
const AnnotationInlineViewer2_1 = require("./AnnotationInlineViewer2");
const StartReviewDropdown_1 = require("./filter_bar/StartReviewDropdown");
const AnnotationRepoRoutedComponents_1 = require("./AnnotationRepoRoutedComponents");
const StartReviewSpeedDial_1 = require("./StartReviewSpeedDial");
const FeedbackButton2_1 = require("../ui/FeedbackButton2");
const MUIElevation_1 = require("../../../../web/js/mui/MUIElevation");
var main;
(function (main) {
    main.Phone = () => (React.createElement(DockLayout_1.DockLayout, { dockPanels: [
            {
                id: 'dock-panel-center',
                type: 'grow',
                component: React.createElement(AnnotationListView2_1.AnnotationListView2, null),
            },
        ] }));
    main.Tablet = () => (React.createElement(DockLayout_1.DockLayout, { dockPanels: [
            {
                id: 'dock-panel-center',
                type: 'fixed',
                style: {
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                },
                component: React.createElement(AnnotationRepoTable2_1.AnnotationRepoTable2, null),
                width: 450
            },
            {
                id: 'dock-panel-right',
                type: 'grow',
                component: React.createElement(AnnotationInlineViewer2_1.AnnotationInlineViewer2, null)
            }
        ] }));
    main.Desktop = () => (React.createElement(DockLayout_1.DockLayout, { dockPanels: [
            {
                id: 'dock-panel-left',
                type: 'fixed',
                style: {
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                },
                component: React.createElement(FolderSidebar2_1.FolderSidebar2, null),
                width: 300
            },
            {
                id: 'dock-panel-center',
                type: 'fixed',
                style: {
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                },
                component: React.createElement(Paper_1.default, { square: true, elevation: 0, style: {
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0
                    } },
                    React.createElement(AnnotationRepoTable2_1.AnnotationRepoTable2, null)),
                width: 450
            },
            {
                id: 'dock-panel-right',
                type: 'grow',
                style: {
                    display: 'flex'
                },
                component: React.createElement(MUIElevation_1.MUIElevation, { elevation: 2, style: {
                        flexGrow: 1,
                        display: 'flex'
                    } },
                    React.createElement(AnnotationInlineViewer2_1.AnnotationInlineViewer2, null))
            }
        ] }));
})(main || (main = {}));
var screen;
(function (screen) {
    screen.Handheld = () => {
        return (React.createElement(FixedNav_1.FixedNav, { id: "doc-repository", className: "annotations-view" },
            React.createElement(AnnotationRepoRoutedComponents_1.AnnotationRepoRoutedComponents, null),
            React.createElement(FixedNav_1.FixedNav.Body, null,
                React.createElement(Paper_1.default, { square: true, elevation: 0, style: {
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0
                    } },
                    React.createElement(StartReviewSpeedDial_1.StartReviewSpeedDial, null),
                    React.createElement(DeviceRouter_1.DeviceRouter, { phone: React.createElement(main.Phone, null), tablet: React.createElement(main.Tablet, null) })))));
    };
    screen.Desktop = () => (React.createElement(FixedNav_1.FixedNav, { id: "doc-repository", className: "annotations-view" },
        React.createElement("header", null,
            React.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { id: "header-filter", padding: 1, borderBottom: true },
                React.createElement("div", { style: {
                        display: 'flex',
                        alignItems: 'center'
                    } },
                    React.createElement(StartReviewDropdown_1.StartReviewDropdown, null),
                    React.createElement("div", { style: {
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        } },
                        React.createElement(AnnotationRepoFilterBar2_1.AnnotationRepoFilterBar2, null))))),
        React.createElement(AnnotationRepoRoutedComponents_1.AnnotationRepoRoutedComponents, null),
        React.createElement(main.Desktop, null),
        React.createElement(FeedbackButton2_1.FeedbackButton2, null),
        React.createElement(RepoFooter_1.RepoFooter, null)));
})(screen || (screen = {}));
exports.AnnotationRepoScreen2 = React.memo(() => (React.createElement(React.Fragment, null,
    React.createElement(DeviceRouter_1.DeviceRouter, { desktop: React.createElement(screen.Desktop, null), handheld: React.createElement(screen.Handheld, null) }))));
//# sourceMappingURL=AnnotationRepoScreen2.js.map