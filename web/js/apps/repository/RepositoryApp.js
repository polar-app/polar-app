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
exports.RepositoryApp = exports.RepositoryDocViewerScreen = void 0;
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const WhatsNewScreen_1 = __importDefault(require("../../../../apps/repository/js/whats_new/WhatsNewScreen"));
const StatsScreen_1 = require("../../../../apps/repository/js/stats/StatsScreen");
const PricingScreen_1 = require("../../../../apps/repository/js/premium/PricingScreen");
const SupportScreen_1 = require("../../../../apps/repository/js/support/SupportScreen");
const AuthRequired_1 = require("../../../../apps/repository/js/AuthRequired");
const PersistenceLayerApp_1 = require("../../../../apps/repository/js/persistence_layer/PersistenceLayerApp");
const InviteScreen_1 = require("../../../../apps/repository/js/invite/InviteScreen");
const AccountControlSidebar_1 = require("../../../../apps/repository/js/AccountControlSidebar");
const ReactRouters_1 = require("../../react/router/ReactRouters");
const Cached_1 = require("../../react/Cached");
const SettingsScreen_1 = require("../../../../apps/repository/js/configure/settings/SettingsScreen");
const DeviceScreen_1 = require("../../../../apps/repository/js/device/DeviceScreen");
const MUIRepositoryRoot_1 = require("../../mui/MUIRepositoryRoot");
const DocRepoScreen2_1 = require("../../../../apps/repository/js/doc_repo/DocRepoScreen2");
const DocRepoStore2_1 = require("../../../../apps/repository/js/doc_repo/DocRepoStore2");
const DocRepoSidebarTagStore_1 = require("../../../../apps/repository/js/doc_repo/DocRepoSidebarTagStore");
const AnnotationRepoSidebarTagStore_1 = require("../../../../apps/repository/js/annotation_repo/AnnotationRepoSidebarTagStore");
const AnnotationRepoStore_1 = require("../../../../apps/repository/js/annotation_repo/AnnotationRepoStore");
const AnnotationRepoScreen2_1 = require("../../../../apps/repository/js/annotation_repo/AnnotationRepoScreen2");
const ReviewerRouter_1 = require("../../../../apps/repository/js/reviewer/ReviewerRouter");
const PersistentRoute_1 = require("./PersistentRoute");
const LoginScreen_1 = require("../../../../apps/repository/js/login/LoginScreen");
const UserTagsProvider2_1 = require("../../../../apps/repository/js/persistence_layer/UserTagsProvider2");
const DocMetaContextProvider_1 = require("../../annotation_sidebar/DocMetaContextProvider");
const DocViewerDocMetaLookupContextProvider_1 = require("../../../../apps/doc/src/DocViewerDocMetaLookupContextProvider");
const DocViewerStore_1 = require("../../../../apps/doc/src/DocViewerStore");
const DocFindStore_1 = require("../../../../apps/doc/src/DocFindStore");
const AnnotationSidebarStore_1 = require("../../../../apps/doc/src/AnnotationSidebarStore");
const DocViewer_1 = require("../../../../apps/doc/src/DocViewer");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const RepositoryRoot_1 = require("./RepositoryRoot");
const AddFileDropzoneScreen_1 = require("./upload/AddFileDropzoneScreen");
const AnkiSyncController_1 = require("../../controller/AnkiSyncController");
const ErrorScreen_1 = require("../../../../apps/repository/js/ErrorScreen");
const RepoHeader3_1 = require("../../../../apps/repository/js/repo_header/RepoHeader3");
const RepoFooter_1 = require("../../../../apps/repository/js/repo_footer/RepoFooter");
const MUIDialogController_1 = require("../../mui/dialogs/MUIDialogController");
const UseLocationChangeStore_1 = require("../../../../apps/doc/src/annotations/UseLocationChangeStore");
const UseLocationChangeRoot_1 = require("../../../../apps/doc/src/annotations/UseLocationChangeRoot");
const ReactUtils_1 = require("../../react/ReactUtils");
const PHZMigrationScreen_1 = require("./migrations/PHZMigrationScreen");
const AddFileDropzoneRoot_1 = require("./upload/AddFileDropzoneRoot");
const TwoMigrationForBrowser_1 = require("../../../../apps/repository/js/gateways/two_migration/TwoMigrationForBrowser");
const AnalyticsLocationListener_1 = require("../../analytics/AnalyticsLocationListener");
exports.RepositoryDocViewerScreen = ReactUtils_1.deepMemo((props) => {
    return (React.createElement(AuthRequired_1.AuthRequired, null,
        React.createElement(PersistenceLayerApp_1.PersistenceLayerContext.Provider, { value: { persistenceLayerProvider: props.persistenceLayerProvider } },
            React.createElement(UserTagsProvider2_1.UserTagsProvider, null,
                React.createElement(DocMetaContextProvider_1.DocMetaContextProvider, null,
                    React.createElement(DocViewerDocMetaLookupContextProvider_1.DocViewerDocMetaLookupContextProvider, null,
                        React.createElement(DocViewerStore_1.DocViewerStore, null,
                            React.createElement(DocFindStore_1.DocFindStore, null,
                                React.createElement(AnnotationSidebarStore_1.AnnotationSidebarStoreProvider, null,
                                    React.createElement(DocViewer_1.DocViewer, null))))))))));
});
exports.RepositoryApp = (props) => {
    const { app, repoDocMetaManager, repoDocMetaLoader, persistenceLayerManager } = props;
    Preconditions_1.Preconditions.assertPresent(app, 'app');
    const RenderDocViewerScreen = React.memo(() => (React.createElement(exports.RepositoryDocViewerScreen, { persistenceLayerProvider: app.persistenceLayerProvider })));
    const RenderDocRepoScreen = React.memo(() => (React.createElement(AuthRequired_1.AuthRequired, null,
        React.createElement(PersistenceLayerApp_1.PersistenceLayerApp, { tagsType: "documents", repoDocMetaManager: repoDocMetaManager, repoDocMetaLoader: repoDocMetaLoader, persistenceLayerManager: persistenceLayerManager, render: () => React.createElement(DocRepoStore2_1.DocRepoStore2, null,
                React.createElement(DocRepoSidebarTagStore_1.DocRepoSidebarTagStore, null,
                    React.createElement(TwoMigrationForBrowser_1.TwoMigrationForBrowser, null,
                        React.createElement(React.Fragment, null,
                            React.createElement(AnkiSyncController_1.AnkiSyncController, null),
                            React.createElement(DocRepoScreen2_1.DocRepoScreen2, null))))) }))));
    const RenderAnnotationRepoScreen = React.memo(() => {
        return (React.createElement(AuthRequired_1.AuthRequired, null,
            React.createElement(PersistenceLayerApp_1.PersistenceLayerApp, { tagsType: "annotations", repoDocMetaManager: repoDocMetaManager, repoDocMetaLoader: repoDocMetaLoader, persistenceLayerManager: persistenceLayerManager, render: (props) => React.createElement(AnnotationRepoStore_1.AnnotationRepoStore2, null,
                    React.createElement(AnnotationRepoSidebarTagStore_1.AnnotationRepoSidebarTagStore, null,
                        React.createElement(React.Fragment, null,
                            React.createElement(ReviewerRouter_1.ReviewRouter, null),
                            React.createElement(AnnotationRepoScreen2_1.AnnotationRepoScreen2, null)))) })));
    });
    const RenderSettingsScreen = () => (React.createElement(Cached_1.Cached, null,
        React.createElement(SettingsScreen_1.SettingsScreen, null)));
    const renderDeviceScreen = () => (React.createElement(Cached_1.Cached, null,
        React.createElement(DeviceScreen_1.DeviceScreen, null)));
    const RenderDefaultScreen = React.memo(() => (React.createElement(RenderDocRepoScreen, null)));
    const renderWhatsNewScreen = () => (React.createElement(WhatsNewScreen_1.default, null));
    const renderStatsScreen = () => (React.createElement(AuthRequired_1.AuthRequired, null,
        React.createElement(PersistenceLayerApp_1.PersistenceLayerApp, { tagsType: "documents", repoDocMetaManager: repoDocMetaManager, repoDocMetaLoader: repoDocMetaLoader, persistenceLayerManager: persistenceLayerManager, render: (docRepo) => React.createElement(StatsScreen_1.StatsScreen, null) })));
    const premiumScreen = () => {
        return (React.createElement(PricingScreen_1.PricingScreen, null));
    };
    const premiumScreenYear = () => {
        return (React.createElement(PricingScreen_1.PricingScreen, null));
    };
    const supportScreen = () => {
        return (React.createElement(SupportScreen_1.SupportScreen, null));
    };
    const renderInvite = () => {
        return React.createElement(InviteScreen_1.InviteScreen, null);
    };
    return (React.createElement(MUIRepositoryRoot_1.MUIRepositoryRoot, null,
        React.createElement(RepositoryRoot_1.RepositoryRoot, null,
            React.createElement(PersistenceLayerApp_1.PersistenceLayerContext.Provider, { value: { persistenceLayerProvider: app.persistenceLayerProvider } },
                React.createElement("div", { className: "RepositoryApp", style: {
                        display: 'flex',
                        minWidth: 0,
                        minHeight: 0,
                        flexDirection: 'column',
                        flexGrow: 1
                    } },
                    React.createElement(React.Fragment, null,
                        React.createElement(UseLocationChangeStore_1.UseLocationChangeStoreProvider, null,
                            React.createElement(react_router_dom_1.BrowserRouter, null,
                                React.createElement(AnalyticsLocationListener_1.AnalyticsLocationListener, null),
                                React.createElement(UseLocationChangeRoot_1.UseLocationChangeRoot, null,
                                    React.createElement(MUIDialogController_1.MUIDialogController, null,
                                        React.createElement(AddFileDropzoneRoot_1.AddFileDropzoneRoot, null,
                                            React.createElement(React.Fragment, null,
                                                React.createElement(react_router_dom_1.Switch, null,
                                                    React.createElement(react_router_dom_1.Route, { exact: true, path: ["/login", "/login.html"] },
                                                        React.createElement(LoginScreen_1.LoginScreen, null)),
                                                    React.createElement(react_router_dom_1.Route, { exact: true, path: ["/doc", "/doc/:id"] },
                                                        React.createElement(RenderDocViewerScreen, null)),
                                                    React.createElement(react_router_dom_1.Route, { exact: true, path: "/error" },
                                                        React.createElement(ErrorScreen_1.ErrorScreen, null)),
                                                    React.createElement(react_router_dom_1.Route, { exact: true, path: "/migration/phz" },
                                                        React.createElement(PHZMigrationScreen_1.PHZMigrationScreen, null)),
                                                    React.createElement(react_router_dom_1.Route, null,
                                                        React.createElement(RepoHeader3_1.RepoHeader3, null),
                                                        React.createElement(PersistentRoute_1.PersistentRoute, { exact: true, path: "/" },
                                                            React.createElement(RenderDefaultScreen, null)),
                                                        React.createElement(PersistentRoute_1.PersistentRoute, { exact: true, path: "/annotations" },
                                                            React.createElement(RenderAnnotationRepoScreen, null)),
                                                        React.createElement(react_router_dom_1.Switch, { location: ReactRouters_1.ReactRouters.createLocationWithPathOnly() },
                                                            React.createElement(react_router_dom_1.Route, { exact: true, path: '/whats-new', render: renderWhatsNewScreen }),
                                                            React.createElement(react_router_dom_1.Route, { exact: true, path: '/invite', render: renderInvite }),
                                                            React.createElement(react_router_dom_1.Route, { exact: true, path: '/plans', render: premiumScreen }),
                                                            React.createElement(react_router_dom_1.Route, { exact: true, path: '/plans-year', render: premiumScreenYear }),
                                                            React.createElement(react_router_dom_1.Route, { exact: true, path: '/premium', render: premiumScreen }),
                                                            React.createElement(react_router_dom_1.Route, { exact: true, path: '/support', render: supportScreen }),
                                                            React.createElement(react_router_dom_1.Route, { exact: true, path: '/stats', component: renderStatsScreen }),
                                                            React.createElement(react_router_dom_1.Route, { exact: true, path: "/settings", component: RenderSettingsScreen }),
                                                            React.createElement(react_router_dom_1.Route, { exact: true, path: "/device", component: renderDeviceScreen })),
                                                        React.createElement(RepoFooter_1.RepoFooter, null))),
                                                React.createElement(react_router_dom_1.Switch, { location: ReactRouters_1.ReactRouters.createLocationWithHashOnly() },
                                                    React.createElement(react_router_dom_1.Route, { path: '#account', component: () => React.createElement(Cached_1.Cached, null,
                                                            React.createElement(AccountControlSidebar_1.AccountControlSidebar, { persistenceLayerController: app.persistenceLayerController })) }),
                                                    React.createElement(react_router_dom_1.Route, { path: '#add' },
                                                        React.createElement(AuthRequired_1.AuthRequired, null,
                                                            React.createElement(PersistenceLayerApp_1.PersistenceLayerContext.Provider, { value: { persistenceLayerProvider: app.persistenceLayerProvider } },
                                                                React.createElement(AddFileDropzoneScreen_1.AddFileDropzoneScreen, null)))))))))))))))));
};
//# sourceMappingURL=RepositoryApp.js.map