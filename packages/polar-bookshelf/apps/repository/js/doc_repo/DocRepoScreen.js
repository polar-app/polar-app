"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Tags_1 = require("polar-shared/src/tags/Tags");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const MessageBanner_1 = require("../MessageBanner");
const DocRepoTableColumns_1 = require("./DocRepoTableColumns");
const SettingsStore_1 = require("../../../../web/js/datastore/SettingsStore");
const RepoDocMetaLoaders_1 = require("../RepoDocMetaLoaders");
const SynchronizingDocLoader_1 = require("../util/SynchronizingDocLoader");
const ReleasingReactComponent_1 = __importDefault(require("../framework/ReleasingReactComponent"));
const RepoHeader_1 = require("../repo_header/RepoHeader");
const FixedNav_1 = require("../FixedNav");
const Functions_1 = require("polar-shared/src/util/Functions");
const DocRepoFilters_1 = require("./DocRepoFilters");
const Toaster_1 = require("../../../../web/js/ui/toaster/Toaster");
const ProgressTracker_1 = require("polar-shared/src/util/ProgressTracker");
const ProgressMessages_1 = require("../../../../web/js/ui/progress_bar/ProgressMessages");
const Dialogs_1 = require("../../../../web/js/ui/dialogs/Dialogs");
const DocRepoButtonBar_1 = require("./DocRepoButtonBar");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const Numbers_1 = require("polar-shared/src/util/Numbers");
const SelectedDocs_1 = require("./SelectedDocs");
const TreeState_1 = require("../../../../web/js/ui/tree/TreeState");
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
const FolderSidebar_1 = require("../folders/FolderSidebar");
const IDMaps_1 = require("polar-shared/src/util/IDMaps");
const PersistenceLayerMutator_1 = require("../persistence_layer/PersistenceLayerMutator");
const RepositoryTour_1 = require("../../../../web/js/apps/repository/RepositoryTour");
const DockLayout_1 = require("../../../../web/js/ui/doc_layout/DockLayout");
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const RepoFooter_1 = require("../repo_footer/RepoFooter");
const AddContentButton_1 = require("../ui/AddContentButton");
const react_router_1 = require("react-router");
const ReactRouters_1 = require("../../../../web/js/react/router/ReactRouters");
const react_router_dom_1 = require("react-router-dom");
const reactstrap_1 = require("reactstrap");
const LeftSidebar_1 = require("../../../../web/js/ui/motion/LeftSidebar");
const Analytics_1 = require("../../../../web/js/analytics/Analytics");
const MUIPaperToolbar_1 = require("../../../../web/js/mui/MUIPaperToolbar");
const DocumentRepositoryTableActions_1 = require("./DocumentRepositoryTableActions");
const log = Logger_1.Logger.create();
var main;
(function (main) {
    const documentActions = DocumentRepositoryTableActions_1.DocumentRepositoryTableActions.create();
    main.Documents = (props) => (React.createElement(React.Fragment, null));
    main.Folders = (props) => (React.createElement(FolderSidebar_1.FolderSidebar, Object.assign({}, props)));
})(main || (main = {}));
const onClose = () => window.history.back();
const Router = (props) => (React.createElement(react_router_1.Switch, { location: ReactRouters_1.ReactRouters.createLocationWithHashOnly() },
    React.createElement(react_router_1.Route, { path: '#folders', render: () => (React.createElement(LeftSidebar_1.LeftSidebar, { onClose: onClose },
            React.createElement(main.Folders, Object.assign({}, props)))) })));
var devices;
(function (devices) {
    devices.PhoneAndTablet = (props) => (React.createElement(main.Documents, Object.assign({}, props)));
    devices.Desktop = (props) => (React.createElement(DockLayout_1.DockLayout, { dockPanels: [
            {
                id: "dock-panel-left",
                type: 'fixed',
                component: React.createElement(FolderSidebar_1.FolderSidebar, Object.assign({}, props)),
                width: 300,
                style: {
                    overflow: 'none'
                }
            },
            {
                id: "doc-panel-center",
                type: 'grow',
                component: React.createElement(main.Documents, Object.assign({}, props))
            }
        ] }));
})(devices || (devices = {}));
class DocRepoScreen extends ReleasingReactComponent_1.default {
    constructor(props, context) {
        super(props, context);
        this.synchronizingDocLoader = new SynchronizingDocLoader_1.SynchronizingDocLoader(this.props.persistenceLayerProvider);
        this.onDocDeleteRequested = this.onDocDeleteRequested.bind(this);
        this.onDocTagged = this.onDocTagged.bind(this);
        this.onDocDeleted = this.onDocDeleted.bind(this);
        this.onDocSetTitle = this.onDocSetTitle.bind(this);
        this.onSelectedColumns = this.onSelectedColumns.bind(this);
        this.onDocSidebarVisible = this.onDocSidebarVisible.bind(this);
        this.onFilterByTitle = this.onFilterByTitle.bind(this);
        this.onToggleFilterArchived = this.onToggleFilterArchived.bind(this);
        this.onToggleFlaggedOnly = this.onToggleFlaggedOnly.bind(this);
        this.clearSelected = this.clearSelected.bind(this);
        this.onSelected = this.onSelected.bind(this);
        this.selectRow = this.selectRow.bind(this);
        this.onDocTagged = this.onDocTagged.bind(this);
        this.onMultiDeleted = this.onMultiDeleted.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.getRow = this.getRow.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onRemoveFromTag = this.onRemoveFromTag.bind(this);
        this.createDeviceProps = this.createDeviceProps.bind(this);
        this.state = {
            data: [],
            columns: IDMaps_1.IDMaps.create(Object.values(new DocRepoTableColumns_1.DocRepoTableColumns())),
            selected: [],
            docSidebarVisible: false
        };
        const onRefreshed = repoDocInfos => this.onData(repoDocInfos);
        const repoDocInfosProvider = () => this.props.repoDocMetaManager.repoDocInfoIndex.values();
        this.tagsProvider = this.props.tags;
        this.persistenceLayerMutator
            = new PersistenceLayerMutator_1.PersistenceLayerMutator(this.props.repoDocMetaManager, this.props.persistenceLayerProvider, this.tagsProvider);
        this.docRepoFilters = new DocRepoFilters_1.DocRepoFilters(onRefreshed, repoDocInfosProvider);
        const onSelected = (tags) => this.docRepoFilters.onTagged(tags.map(current => Tags_1.Tags.create(current)));
        const onDropped = (tag) => this.onDocTagged(SelectedDocs_1.DraggingSelectedDocs.get() || [], [tag]);
        this.treeState = new TreeState_1.TreeState(onSelected, onDropped);
        this.init();
        this.initAsync()
            .catch(err => log.error("Could not init: ", err));
    }
    init() {
        const persistenceLayer = this.props.persistenceLayerProvider();
        this.releaser.register(persistenceLayer.addEventListener(() => this.refresh()));
        this.releaser.register(RepoDocMetaLoaders_1.RepoDocMetaLoaders.addThrottlingEventListener(this.props.repoDocMetaLoader, () => this.refresh()));
        this.releaser.register(this.props.repoDocMetaLoader.addEventListener(event => {
            if (!DocRepoScreen.hasSentInitAnalytics && event.progress.progress === 100) {
                this.emitInitAnalytics(this.props.repoDocMetaManager.repoDocInfoIndex.size());
                DocRepoScreen.hasSentInitAnalytics = true;
            }
        }));
    }
    initAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const settingProvider = yield SettingsStore_1.SettingsStore.load();
            log.info("Settings loaded: ", settingProvider);
            Optional_1.Optional.of(settingProvider().documentRepository)
                .map(current => current.columns)
                .when(columns => {
                log.info("Loaded columns from settings: ", columns);
                this.setState(Object.assign(Object.assign({}, this.state), { columns }));
                this.refresh();
            });
            this.refresh();
        });
    }
    emitInitAnalytics(nrDocs) {
        Analytics_1.Analytics.traits({ 'nrDocs': nrDocs });
        const persistenceLayerType = this.props.persistenceLayerController.currentType();
    }
    onDocTagged(repoDocInfos, tags) {
        const doTag = (repoDocInfo, tags) => __awaiter(this, void 0, void 0, function* () {
            yield this.props.repoDocMetaManager.writeDocInfoTags(repoDocInfo, tags);
            this.refresh();
        });
        for (const repoDocInfo of repoDocInfos) {
            const existingTags = Object.values(repoDocInfo.tags || {});
            const effectiveTags = Tags_1.Tags.union(existingTags, tags || []);
            doTag(repoDocInfo, effectiveTags)
                .catch(err => log.error(err));
        }
    }
    onRemoveFromTag(rawTag, repoDocInfos) {
        for (const repoDocInfo of repoDocInfos) {
            const existingTags = Object.values(repoDocInfo.tags || {});
            const newTags = Tags_1.Tags.difference(existingTags, [rawTag]);
            this.onDocTagged([repoDocInfo], newTags);
        }
    }
    onMultiDeleted() {
        const repoDocInfos = this.getSelected();
        this.onDocDeleteRequested(repoDocInfos);
    }
    clearSelected() {
        setTimeout(() => {
            this.setState(Object.assign(Object.assign({}, this.state), { selected: [] }));
        }, 1);
    }
    getSelected() {
        if (!this.reactTable) {
            return [];
        }
        const resolvedState = this.reactTable.getResolvedState();
        const { sortedData } = resolvedState;
        const offset = (resolvedState.page) * resolvedState.pageSize;
        const result = this.state.selected
            .map(selectedIdx => sortedData[offset + selectedIdx])
            .filter(item => Preconditions_1.isPresent(item))
            .map(item => item._original);
        return result;
    }
    getRow(viewIndex) {
        const resolvedState = this.reactTable.getResolvedState();
        const { sortedData } = resolvedState;
        const offset = (resolvedState.page) * resolvedState.pageSize;
        const idx = offset + viewIndex;
        return sortedData[idx]._original;
    }
    selectRow(selectedIdx, event, type) {
        selectedIdx = Numbers_1.Numbers.toNumber(selectedIdx);
        const computeStrategy = () => {
            if (type === 'checkbox') {
                return 'toggle';
            }
            if (type === 'click') {
                if (event.getModifierState("Shift")) {
                    return 'range';
                }
                if (event.getModifierState("Control") || event.getModifierState("Meta")) {
                    return 'toggle';
                }
            }
            if (type === 'context') {
                if (this.state.selected.includes(selectedIdx)) {
                    return 'none';
                }
            }
            return 'one';
        };
        const doStrategyRange = () => {
            let min = 0;
            let max = 0;
            if (this.state.selected.length > 0) {
                const sorted = [...this.state.selected].sort((a, b) => a - b);
                min = Arrays_1.Arrays.first(sorted);
                max = Arrays_1.Arrays.last(sorted);
            }
            const selected = [...Numbers_1.Numbers.range(Math.min(min, selectedIdx), Math.max(max, selectedIdx))];
            return selected;
        };
        const doStrategyToggle = () => {
            const selected = [...this.state.selected];
            if (selected.includes(selectedIdx)) {
                return SetArrays_1.SetArrays.difference(selected, [selectedIdx]);
            }
            else {
                return SetArrays_1.SetArrays.union(selected, [selectedIdx]);
            }
        };
        const doStrategyOne = () => {
            return [selectedIdx];
        };
        const doStrategy = () => {
            const strategy = computeStrategy();
            switch (strategy) {
                case "one":
                    return doStrategyOne();
                case "range":
                    return doStrategyRange();
                case "toggle":
                    return doStrategyToggle();
                case "none":
                    return undefined;
            }
        };
        const selected = doStrategy();
        if (selected) {
            this.setState(Object.assign(Object.assign({}, this.state), { selected }));
        }
    }
    onSelected(selected) {
        this.setState(Object.assign(Object.assign({}, this.state), { selected }));
    }
    createDeviceProps() {
        return null;
    }
    render() {
        const tagsProvider = this.props.tags;
        const deviceProps = this.createDeviceProps();
        return (React.createElement(FixedNav_1.FixedNav, { id: "doc-repository" },
            React.createElement(RepositoryTour_1.RepositoryTour, null),
            React.createElement("header", null,
                React.createElement(RepoHeader_1.RepoHeader, { toggle: (React.createElement(react_router_dom_1.Link, { to: "#folders" },
                        React.createElement(reactstrap_1.Button, { color: "clear" },
                            React.createElement("i", { className: "fas fa-bars" })))), persistenceLayerProvider: this.props.persistenceLayerProvider, persistenceLayerController: this.props.persistenceLayerController }),
                React.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { id: "header-filter", borderBottom: true, padding: 1 },
                    React.createElement("div", { style: {
                            display: 'flex',
                            alignItems: 'center'
                        } },
                        React.createElement("div", { className: "", style: {
                                whiteSpace: 'nowrap',
                                display: 'flex'
                            } },
                            React.createElement(DocRepoButtonBar_1.DocRepoButtonBar, null)),
                        React.createElement("div", { style: { marginLeft: 'auto' } }))),
                React.createElement(MessageBanner_1.MessageBanner, null)),
            React.createElement(Router, Object.assign({}, deviceProps)),
            React.createElement(DeviceRouter_1.DeviceRouter, { phone: React.createElement(devices.PhoneAndTablet, Object.assign({}, deviceProps)), tablet: React.createElement(devices.PhoneAndTablet, Object.assign({}, deviceProps)), desktop: React.createElement(devices.Desktop, Object.assign({}, deviceProps)) }),
            React.createElement(FixedNav_1.FixedNav.Footer, null,
                React.createElement(DeviceRouter_1.DeviceRouter.Handheld, null,
                    React.createElement(AddContentButton_1.AddContent.Handheld, null)),
                React.createElement(RepoFooter_1.RepoFooter, null))));
    }
    onDragStart(event) {
        const configureDragImage = () => {
            const src = document.createElement("div");
            event.dataTransfer.setDragImage(src, 0, 0);
        };
        configureDragImage();
        const selected = this.getSelected();
        SelectedDocs_1.DraggingSelectedDocs.set(selected);
    }
    onDragEnd() {
        SelectedDocs_1.DraggingSelectedDocs.clear();
    }
    onDocDeleteRequested(repoDocInfos) {
        Dialogs_1.Dialogs.confirm({
            title: "Are you sure you want to delete these document(s)?",
            subtitle: "This is a permanent operation and can't be undone.  All associated annotations will also be removed.",
            onCancel: Functions_1.NULL_FUNCTION,
            type: 'danger',
            onConfirm: () => this.onDocDeleted(repoDocInfos),
        });
    }
    onDocSidebarVisible(docSidebarVisible) {
        this.setState(Object.assign(Object.assign({}, this.state), { docSidebarVisible }));
    }
    onDocDeleted(repoDocInfos) {
        const doDeletes = () => __awaiter(this, void 0, void 0, function* () {
            const stats = {
                successes: 0,
                failures: 0
            };
            this.clearSelected();
            const progressTracker = new ProgressTracker_1.ProgressTracker({ total: repoDocInfos.length, id: 'delete' });
            for (const repoDocInfo of repoDocInfos) {
                log.info("Deleting document: ", repoDocInfo);
                try {
                    yield this.props.repoDocMetaManager.deleteDocInfo(repoDocInfo);
                    ++stats.successes;
                    this.refresh();
                }
                catch (e) {
                    ++stats.failures;
                    log.error("Could not delete doc: ", e);
                }
                finally {
                    const progress = progressTracker.incr();
                    ProgressMessages_1.ProgressMessages.broadcast(progress);
                }
            }
            this.clearSelected();
            if (stats.failures === 0) {
                Toaster_1.Toaster.success(`${stats.successes} documents successfully deleted.`);
            }
            else {
                Toaster_1.Toaster.error(`Failed to delete ${stats.failures} with ${stats.successes} successful.`);
            }
        });
        doDeletes()
            .catch(err => log.error("Unable to delete files: ", err));
    }
    onDocSetTitle(repoDocInfo, title) {
        log.info("Setting doc title: ", title);
        this.props.repoDocMetaManager.writeDocInfoTitle(repoDocInfo, title)
            .catch(err => log.error("Could not write doc title: ", err));
        this.refresh();
    }
    onSelectedColumns(columns) {
        const columns_map = IDMaps_1.IDMaps.create(columns);
        setTimeout(() => {
            this.setState(Object.assign(Object.assign({}, this.state), { columns: columns_map }));
        }, 1);
        SettingsStore_1.SettingsStore.load()
            .then((settingsProvider) => {
            const currentSettings = settingsProvider();
            const settings = Object.assign(Object.assign({}, currentSettings), { documentRepository: {
                    columns: columns_map
                } });
            SettingsStore_1.SettingsStore.write(settings)
                .catch(err => log.error(err));
        })
            .catch(err => log.error("Could not load settings: ", err));
        this.refresh();
    }
    onFilterByTitle(title) {
        Preconditions_1.Preconditions.assertString(title, 'title');
        this.docRepoFilters.onFilterByTitle(title);
    }
    refresh() {
        this.docRepoFilters.refresh();
    }
    onData(data) {
        setTimeout(() => {
            this.setState(Object.assign(Object.assign({}, this.state), { data }));
        }, 1);
    }
    onToggleFlaggedOnly(value) {
        this.docRepoFilters.onToggleFlaggedOnly(value);
    }
    onToggleFilterArchived(value) {
        this.docRepoFilters.onToggleFilterArchived(value);
    }
}
exports.default = DocRepoScreen;
DocRepoScreen.hasSentInitAnalytics = false;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jUmVwb1NjcmVlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRvY1JlcG9TY3JlZW4udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUErQjtBQUMvQiwyREFBc0Q7QUFJdEQsZ0VBQTJEO0FBQzNELHFEQUE2RDtBQUM3RCxrRUFBd0U7QUFDeEUsb0RBQStDO0FBRS9DLCtEQUcrQjtBQUMvQiw4RUFBeUU7QUFJekUsOERBQXlEO0FBQ3pELDJFQUFzRTtBQUN0RSxtR0FBMkU7QUFDM0UsMERBQXFEO0FBQ3JELDBDQUFxQztBQUVyQywrREFBOEQ7QUFFOUQscURBQW1FO0FBRW5FLG1FQUE4RDtBQUM5RCwyRUFBc0U7QUFDdEUsMEZBQXFGO0FBQ3JGLG1FQUE4RDtBQUM5RCx5REFBb0Q7QUFHcEQseURBQW9EO0FBQ3BELDJEQUFzRDtBQUN0RCxpREFBb0Q7QUFDcEQsb0VBQStEO0FBQy9ELCtEQUEwRDtBQUMxRCw0REFBNEU7QUFDNUUseURBQW9EO0FBR3BELDBGQUFxRjtBQUVyRixzRkFBaUY7QUFDakYsNEVBQXVFO0FBQ3ZFLHFFQUFnRTtBQUNoRSwwREFBcUQ7QUFDckQsNkRBQWtEO0FBQ2xELCtDQUEyQztBQUMzQywrRUFBMEU7QUFDMUUsdURBQXNDO0FBQ3RDLDJDQUFrQztBQUNsQywwRUFBcUU7QUFDckUsc0VBQWlFO0FBQ2pFLDRFQUF1RTtBQUN2RSxxRkFBZ0Y7QUFFaEYsTUFBTSxHQUFHLEdBQUcsZUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTVCLElBQVUsSUFBSSxDQXdDYjtBQXhDRCxXQUFVLElBQUk7SUFRVixNQUFNLGVBQWUsR0FBRywrREFBOEIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUVuRCxjQUFTLEdBQUcsQ0FBQyxLQUFxQixFQUFFLEVBQUUsQ0FBQyxDQUNoRCx5Q0FpQkcsQ0FFTixDQUFDO0lBTVcsWUFBTyxHQUFHLENBQUMsS0FBMEIsRUFBRSxFQUFFLENBQUMs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dCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICdwb2xhci1zaGFyZWQvc3JjL2xvZ2dlci9Mb2dnZXInO1xuaW1wb3J0IHtSZXBvRG9jTWV0YUxvYWRlcn0gZnJvbSAnLi4vUmVwb0RvY01ldGFMb2FkZXInO1xuaW1wb3J0IHtSZXBvRG9jSW5mb30gZnJvbSAnLi4vUmVwb0RvY0luZm8nO1xuaW1wb3J0IHtSZXBvRG9jTWV0YU1hbmFnZXJ9IGZyb20gJy4uL1JlcG9Eb2NNZXRhTWFuYWdlcic7XG5pbXBvcnQge09wdGlvbmFsfSBmcm9tICdwb2xhci1zaGFyZWQvc3JjL3V0aWwvdHMvT3B0aW9uYWwnO1xuaW1wb3J0IHtUYWcsIFRhZ3MsIFRhZ1N0cn0gZnJvbSAncG9sYXItc2hhcmVkL3NyYy90YWdzL1RhZ3MnO1xuaW1wb3J0IHtpc1ByZXNlbnQsIFByZWNvbmRpdGlvbnN9IGZyb20gJ3BvbGFyLXNoYXJlZC9zcmMvUHJlY29uZGl0aW9ucyc7XG5pbXBvcnQge01lc3NhZ2VCYW5uZXJ9IGZyb20gJy4uL01lc3NhZ2VCYW5uZXInO1xuaW1wb3J0IHtEb2NSZXBvVGFibGVEcm9wZG93bn0gZnJvbSAnLi9Eb2NSZXBvVGFibGVEcm9wZG93bic7XG5pbXBvcnQge1xuICAgIERvY1JlcG9UYWJsZUNvbHVtbnMsXG4gICAgRG9jUmVwb1RhYmxlQ29sdW1uc01hcFxufSBmcm9tICcuL0RvY1JlcG9UYWJsZUNvbHVtbnMnO1xuaW1wb3J0IHtTZXR0aW5nc1N0b3JlfSBmcm9tICcuLi8uLi8uLi8uLi93ZWIvanMvZGF0YXN0b3JlL1NldHRpbmdzU3RvcmUnO1xuaW1wb3J0IHtJRG9jSW5mb30gZnJvbSAncG9sYXItc2hhcmVkL3NyYy9tZXRhZGF0YS9JRG9jSW5mbyc7XG5pbXBvcnQge0lFdmVudERpc3BhdGNoZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3dlYi9qcy9yZWFjdG9yL1NpbXBsZVJlYWN0b3InO1xuaW1wb3J0IHtQZXJzaXN0ZW5jZUxheWVyQ29udHJvbGxlcn0gZnJvbSAnLi4vLi4vLi4vLi4vd2ViL2pzL2RhdGFzdG9yZS9QZXJzaXN0ZW5jZUxheWVyTWFuYWdlcic7XG5pbXBvcnQge1JlcG9Eb2NNZXRhTG9hZGVyc30gZnJvbSAnLi4vUmVwb0RvY01ldGFMb2FkZXJzJztcbmltcG9ydCB7U3luY2hyb25pemluZ0RvY0xvYWRlcn0gZnJvbSAnLi4vdXRpbC9TeW5jaHJvbml6aW5nRG9jTG9hZGVyJztcbmltcG9ydCBSZWxlYXNpbmdSZWFjdENvbXBvbmVudCBmcm9tICcuLi9mcmFtZXdvcmsvUmVsZWFzaW5nUmVhY3RDb21wb25lbnQnO1xuaW1wb3J0IHtSZXBvSGVhZGVyfSBmcm9tICcuLi9yZXBvX2hlYWRlci9SZXBvSGVhZGVyJztcbmltcG9ydCB7Rml4ZWROYXZ9IGZyb20gJy4uL0ZpeGVkTmF2JztcbmltcG9ydCB7TGlzdE9wdGlvblR5cGV9IGZyb20gJy4uLy4uLy4uLy4uL3dlYi9qcy91aS9saXN0X3NlbGVjdG9yL0xpc3RTZWxlY3Rvcic7XG5pbXBvcnQge05VTExfRlVOQ1RJT059IGZyb20gJ3BvbGFyLXNoYXJlZC9zcmMvdXRpbC9GdW5jdGlvbnMnO1xuaW1wb3J0IHtEb2NSZXBvRmlsdGVyQmFyfSBmcm9tICcuL0RvY1JlcG9GaWx0ZXJCYXInO1xuaW1wb3J0IHtEb2NSZXBvRmlsdGVycywgUmVmcmVzaGVkQ2FsbGJhY2t9IGZyb20gJy4vRG9jUmVwb0ZpbHRlcnMnO1xuaW1wb3J0IHtTZXR0aW5nc30gZnJvbSAnLi4vLi4vLi4vLi4vd2ViL2pzL2RhdGFzdG9yZS9TZXR0aW5ncyc7XG5pbXBvcnQge1RvYXN0ZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3dlYi9qcy91aS90b2FzdGVyL1RvYXN0ZXInO1xuaW1wb3J0IHtQcm9ncmVzc1RyYWNrZXJ9IGZyb20gJ3BvbGFyLXNoYXJlZC9zcmMvdXRpbC9Qcm9ncmVzc1RyYWNrZXInO1xuaW1wb3J0IHtQcm9ncmVzc01lc3NhZ2VzfSBmcm9tICcuLi8uLi8uLi8uLi93ZWIvanMvdWkvcHJvZ3Jlc3NfYmFyL1Byb2dyZXNzTWVzc2FnZXMnO1xuaW1wb3J0IHtEaWFsb2dzfSBmcm9tICcuLi8uLi8uLi8uLi93ZWIvanMvdWkvZGlhbG9ncy9EaWFsb2dzJztcbmltcG9ydCB7RG9jUmVwb0J1dHRvbkJhcn0gZnJvbSAnLi9Eb2NSZXBvQnV0dG9uQmFyJztcbmltcG9ydCB7RG9jUmVwb1RhYmxlUHJvcHMsIERvY1JlcG9UYWJsZX0gZnJvbSAnLi9Eb2NSZXBvVGFibGUnO1xuaW1wb3J0IHtJbnN0YW5jZX0gZnJvbSBcInJlYWN0LXRhYmxlXCI7XG5pbXBvcnQge0FycmF5c30gZnJvbSBcInBvbGFyLXNoYXJlZC9zcmMvdXRpbC9BcnJheXNcIjtcbmltcG9ydCB7TnVtYmVyc30gZnJvbSBcInBvbGFyLXNoYXJlZC9zcmMvdXRpbC9OdW1iZXJzXCI7XG5pbXBvcnQge0RyYWdnaW5nU2VsZWN0ZWREb2NzfSBmcm9tIFwiLi9TZWxlY3RlZERvY3NcIjtcbmltcG9ydCB7VHJlZVN0YXRlfSBmcm9tIFwiLi4vLi4vLi4vLi4vd2ViL2pzL3VpL3RyZWUvVHJlZVN0YXRlXCI7XG5pbXBvcnQge1NldEFycmF5c30gZnJvbSBcInBvbGFyLXNoYXJlZC9zcmMvdXRpbC9TZXRBcnJheXNcIjtcbmltcG9ydCB7Rm9sZGVyU2lkZWJhciwgRm9sZGVyc1NpZGViYXJQcm9wc30gZnJvbSBcIi4uL2ZvbGRlcnMvRm9sZGVyU2lkZWJhclwiO1xuaW1wb3J0IHtJRE1hcHN9IGZyb20gXCJwb2xhci1zaGFyZWQvc3JjL3V0aWwvSURNYXBzXCI7XG5pbXBvcnQge0xpc3RlbmFibGVQZXJzaXN0ZW5jZUxheWVyUHJvdmlkZXJ9IGZyb20gXCIuLi8uLi8uLi8uLi93ZWIvanMvZGF0YXN0b3JlL1BlcnNpc3RlbmNlTGF5ZXJcIjtcbmltcG9ydCB7VGFnRGVzY3JpcHRvcn0gZnJvbSBcInBvbGFyLXNoYXJlZC9zcmMvdGFncy9UYWdEZXNjcmlwdG9yc1wiO1xuaW1wb3J0IHtQZXJzaXN0ZW5jZUxheWVyTXV0YXRvcn0gZnJvbSBcIi4uL3BlcnNpc3RlbmNlX2xheWVyL1BlcnNpc3RlbmNlTGF5ZXJNdXRhdG9yXCI7XG5pbXBvcnQge0RvY1JlcG9SZW5kZXJQcm9wc30gZnJvbSBcIi4uL3BlcnNpc3RlbmNlX2xheWVyL1BlcnNpc3RlbmNlTGF5ZXJBcHBcIjtcbmltcG9ydCB7UmVwb3NpdG9yeVRvdXJ9IGZyb20gXCIuLi8uLi8uLi8uLi93ZWIvanMvYXBwcy9yZXBvc2l0b3J5L1JlcG9zaXRvcnlUb3VyXCI7XG5pbXBvcnQge0RvY2tMYXlvdXR9IGZyb20gXCIuLi8uLi8uLi8uLi93ZWIvanMvdWkvZG9jX2xheW91dC9Eb2NrTGF5b3V0XCI7XG5pbXBvcnQge0RldmljZVJvdXRlcn0gZnJvbSBcIi4uLy4uLy4uLy4uL3dlYi9qcy91aS9EZXZpY2VSb3V0ZXJcIjtcbmltcG9ydCB7UmVwb0Zvb3Rlcn0gZnJvbSBcIi4uL3JlcG9fZm9vdGVyL1JlcG9Gb290ZXJcIjtcbmltcG9ydCB7QWRkQ29udGVudH0gZnJvbSAnLi4vdWkvQWRkQ29udGVudEJ1dHRvbic7XG5pbXBvcnQge1JvdXRlLCBTd2l0Y2h9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcbmltcG9ydCB7UmVhY3RSb3V0ZXJzfSBmcm9tIFwiLi4vLi4vLi4vLi4vd2ViL2pzL3JlYWN0L3JvdXRlci9SZWFjdFJvdXRlcnNcIjtcbmltcG9ydCB7TGlua30gZnJvbSBcInJlYWN0LXJvdXRlci1kb21cIjtcbmltcG9ydCB7QnV0dG9ufSBmcm9tIFwicmVhY3RzdHJhcFwiO1xuaW1wb3J0IHtMZWZ0U2lkZWJhcn0gZnJvbSBcIi4uLy4uLy4uLy4uL3dlYi9qcy91aS9tb3Rpb24vTGVmdFNpZGViYXJcIjtcbmltcG9ydCB7QW5hbHl0aWNzfSBmcm9tIFwiLi4vLi4vLi4vLi4vd2ViL2pzL2FuYWx5dGljcy9BbmFseXRpY3NcIjtcbmltcG9ydCB7TVVJUGFwZXJUb29sYmFyfSBmcm9tIFwiLi4vLi4vLi4vLi4vd2ViL2pzL211aS9NVUlQYXBlclRvb2xiYXJcIjtcbmltcG9ydCB7RG9jdW1lbnRSZXBvc2l0b3J5VGFibGVBY3Rpb25zfSBmcm9tIFwiLi9Eb2N1bWVudFJlcG9zaXRvcnlUYWJsZUFjdGlvbnNcIjtcblxuY29uc3QgbG9nID0gTG9nZ2VyLmNyZWF0ZSgpO1xuXG5uYW1lc3BhY2UgbWFpbiB7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIERvY3VtZW50c1Byb3BzIGV4dGVuZHMgRG9jUmVwb1RhYmxlUHJvcHMge1xuICAgICAgICByZWFkb25seSBkYXRhOiBSZWFkb25seUFycmF5PFJlcG9Eb2NJbmZvPjtcbiAgICAgICAgcmVhZG9ubHkgY29sdW1uczogRG9jUmVwb1RhYmxlQ29sdW1uc01hcDtcbiAgICAgICAgcmVhZG9ubHkgc2VsZWN0ZWQ6IFJlYWRvbmx5QXJyYXk8bnVtYmVyPjtcbiAgICB9XG5cbiAgICBjb25zdCBkb2N1bWVudEFjdGlvbnMgPSBEb2N1bWVudFJlcG9zaXRvcnlUYWJsZUFjdGlvbnMuY3JlYXRlKCk7XG5cbiAgICBleHBvcnQgY29uc3QgRG9jdW1lbnRzID0gKHByb3BzOiBEb2N1bWVudHNQcm9wcykgPT4gKFxuICAgICAgICA8PlxuICAgICAgICAgICAgey8qPERvY1JlcG9UYWJsZSBkYXRhPXtwcm9wcy5kYXRhfSovfVxuICAgICAgICAgICAgey8qICAgICAgICAgICAgICBzZWxlY3RlZD17cHJvcHMuc2VsZWN0ZWR9Ki99XG4gICAgICAgICAgICB7LyogICAgICAgICAgICAgIHNlbGVjdFJvdz17cHJvcHMuc2VsZWN0Um93fSovfVxuICAgICAgICAgICAgey8qICAgICAgICAgICAgICAvLyBzZWxlY3RSb3dzPXtwcm9wcy5vblNlbGVjdGVkfSovfVxuICAgICAgICAgICAgey8qICAgICAgICAgICAgICB0YWdzUHJvdmlkZXI9e3Byb3BzLnRhZ3NQcm92aWRlcn0qL31cbiAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgcmVsYXRlZFRhZ3NNYW5hZ2VyPXtwcm9wcy5yZWxhdGVkVGFnc01hbmFnZXJ9Ki99XG4gICAgICAgICAgICB7LyogICAgICAgICAgICAgIC8vIG9uT3Blbj17KCkgPT4gY29uc29sZS5sb2coJ29uT3BlbicpfSovfVxuICAgICAgICAgICAgey8qICAgICAgICAgICAgICAvLyBvblNob3dGaWxlPXsoKSA9PiBjb25zb2xlLmxvZygnb25TaG93RmlsZScpfSovfVxuICAgICAgICAgICAgey8qICAgICAgICAgICAgICBvblJlbmFtZT17cHJvcHMub25Eb2NTZXRUaXRsZX0qL31cbiAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgb25Db3B5T3JpZ2luYWxVUkw9e2RvY3VtZW50QWN0aW9ucy5vbkNvcHlPcmlnaW5hbFVSTH0qL31cbiAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgb25Db3B5RmlsZVBhdGg9e2RvY3VtZW50QWN0aW9ucy5vbkNvcHlGaWxlUGF0aH0qL31cbiAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgb25EZWxldGVkPXtwcm9wcy5vbkRvY0RlbGV0ZWR9Ki99XG4gICAgICAgICAgICB7LyogICAgICAgICAgICAgIG9uQ29weURvY3VtZW50SUQ9eygpID0+IGNvbnNvbGUubG9nKCdvbkNvcHlEb2N1bWVudElEJyl9Ki99XG4gICAgICAgICAgICB7LyogICAgICAgICAgICAgIG9uVGFnZ2VkPXtwcm9wcy5vbkRvY1RhZ2dlZH0qL31cbiAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgb25GbGFnZ2VkPXsoKSA9PiBjb25zb2xlLmxvZygnb25GbGFnZ2VkJyl9Ki99XG4gICAgICAgICAgICB7LyogICAgICAgICAgICAgIG9uQXJjaGl2ZWQ9eygpID0+IGNvbnNvbGUubG9nKCdvbkFyY2hpdmVkJyl9Lz4qL31cbiAgICAgICAgPC8+XG5cbiAgICApO1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBGb2xkZXJzUHJvcHMgZXh0ZW5kcyBGb2xkZXJzU2lkZWJhclByb3BzIHtcblxuICAgIH1cblxuICAgIGV4cG9ydCBjb25zdCBGb2xkZXJzID0gKHByb3BzOiBGb2xkZXJzU2lkZWJhclByb3BzKSA9PiAoXG4gICAgICAgIDxGb2xkZXJTaWRlYmFyIHsuLi5wcm9wc30vPlxuICAgICk7XG5cbn1cblxuY29uc3Qgb25DbG9zZSA9ICgpID0+IHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblxuY29uc3QgUm91dGVyID0gKHByb3BzOiBtYWluLkZvbGRlcnNQcm9wcykgPT4gKFxuXG4gICAgPFN3aXRjaCBsb2NhdGlvbj17UmVhY3RSb3V0ZXJzLmNyZWF0ZUxvY2F0aW9uV2l0aEhhc2hPbmx5KCl9PlxuXG4gICAgICAgIDxSb3V0ZSBwYXRoPScjZm9sZGVycydcbiAgICAgICAgICAgICAgIHJlbmRlcj17KCkgPT4gKFxuICAgICAgICAgICAgICAgICAgIDxMZWZ0U2lkZWJhciBvbkNsb3NlPXtvbkNsb3NlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgPG1haW4uRm9sZGVycyB7Li4ucHJvcHN9Lz5cbiAgICAgICAgICAgICAgICAgICA8L0xlZnRTaWRlYmFyPlxuICAgICAgICAgICAgICAgKX0vPlxuXG4gICAgPC9Td2l0Y2g+XG5cbik7XG5cbm5hbWVzcGFjZSBkZXZpY2VzIHtcblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGV2aWNlUHJvcHMgZXh0ZW5kcyBtYWluLkRvY3VtZW50c1Byb3BzLCBtYWluLkZvbGRlcnNQcm9wcyB7XG5cbiAgICB9XG5cbiAgICBleHBvcnQgY29uc3QgUGhvbmVBbmRUYWJsZXQgPSAocHJvcHM6IERldmljZVByb3BzKSA9PiAoXG4gICAgICAgIDxtYWluLkRvY3VtZW50cyB7Li4ucHJvcHN9Lz5cbiAgICApO1xuXG4gICAgZXhwb3J0IGNvbnN0IERlc2t0b3AgPSAocHJvcHM6IERldmljZVByb3BzKSA9PiAoXG5cbiAgICAgICAgPERvY2tMYXlvdXQgZG9ja1BhbmVscz17W1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiBcImRvY2stcGFuZWwtbGVmdFwiLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdmaXhlZCcsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiA8Rm9sZGVyU2lkZWJhciB7Li4ucHJvcHN9Lz4sXG4gICAgICAgICAgICAgICAgd2lkdGg6IDMwMCxcbiAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ25vbmUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogXCJkb2MtcGFuZWwtY2VudGVyXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dyb3cnLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDogPG1haW4uRG9jdW1lbnRzIHsuLi5wcm9wc30vPlxuICAgICAgICAgICAgfVxuICAgICAgICBdfS8+XG5cbiAgICApO1xuXG59XG5cbi8vIFJFRkFDVE9SIG1vdmUgYXdheSBmcm9tIFJlbGVhc2luZ1JlYWN0Q29tcG9uZW50IGFuZCBjbGVlbiB0aGlzIHVwLi4uXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb2NSZXBvU2NyZWVuIGV4dGVuZHMgUmVsZWFzaW5nUmVhY3RDb21wb25lbnQ8SVByb3BzLCBJU3RhdGU+IHtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgdHJlZVN0YXRlOiBUcmVlU3RhdGU8VGFnRGVzY3JpcHRvcj47XG5cbiAgICBwcml2YXRlIHN0YXRpYyBoYXNTZW50SW5pdEFuYWx5dGljcyA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBzeW5jaHJvbml6aW5nRG9jTG9hZGVyOiBTeW5jaHJvbml6aW5nRG9jTG9hZGVyO1xuXG4gICAgcHJpdmF0ZSByZWFjdFRhYmxlPzogSW5zdGFuY2U7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGRvY1JlcG9GaWx0ZXJzOiBEb2NSZXBvRmlsdGVycztcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgdGFnc1Byb3ZpZGVyOiAoKSA9PiBSZWFkb25seUFycmF5PFRhZz47XG4gICAgcHJpdmF0ZSBwZXJzaXN0ZW5jZUxheWVyTXV0YXRvcjogUGVyc2lzdGVuY2VMYXllck11dGF0b3I7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogSVByb3BzLCBjb250ZXh0OiBhbnkpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuXG4gICAgICAgIHRoaXMuc3luY2hyb25pemluZ0RvY0xvYWRlciA9IG5ldyBTeW5jaHJvbml6aW5nRG9jTG9hZGVyKHRoaXMucHJvcHMucGVyc2lzdGVuY2VMYXllclByb3ZpZGVyKTtcblxuICAgICAgICB0aGlzLm9uRG9jRGVsZXRlUmVxdWVzdGVkID0gdGhpcy5vbkRvY0RlbGV0ZVJlcXVlc3RlZC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMub25Eb2NUYWdnZWQgPSB0aGlzLm9uRG9jVGFnZ2VkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Eb2NEZWxldGVkID0gdGhpcy5vbkRvY0RlbGV0ZWQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkRvY1NldFRpdGxlID0gdGhpcy5vbkRvY1NldFRpdGxlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25TZWxlY3RlZENvbHVtbnMgPSB0aGlzLm9uU2VsZWN0ZWRDb2x1bW5zLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25Eb2NTaWRlYmFyVmlzaWJsZSA9IHRoaXMub25Eb2NTaWRlYmFyVmlzaWJsZS5iaW5kKHRoaXMpO1xuXG5cbiAgICAgICAgdGhpcy5vbkZpbHRlckJ5VGl0bGUgPSB0aGlzLm9uRmlsdGVyQnlUaXRsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uVG9nZ2xlRmlsdGVyQXJjaGl2ZWQgPSB0aGlzLm9uVG9nZ2xlRmlsdGVyQXJjaGl2ZWQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblRvZ2dsZUZsYWdnZWRPbmx5ID0gdGhpcy5vblRvZ2dsZUZsYWdnZWRPbmx5LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGVkID0gdGhpcy5jbGVhclNlbGVjdGVkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25TZWxlY3RlZCA9IHRoaXMub25TZWxlY3RlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnNlbGVjdFJvdyA9IHRoaXMuc2VsZWN0Um93LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5vbkRvY1RhZ2dlZCA9IHRoaXMub25Eb2NUYWdnZWQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbk11bHRpRGVsZXRlZCA9IHRoaXMub25NdWx0aURlbGV0ZWQuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmdldFNlbGVjdGVkID0gdGhpcy5nZXRTZWxlY3RlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmdldFJvdyA9IHRoaXMuZ2V0Um93LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5vbkRyYWdTdGFydCA9IHRoaXMub25EcmFnU3RhcnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkRyYWdFbmQgPSB0aGlzLm9uRHJhZ0VuZC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMub25SZW1vdmVGcm9tVGFnID0gdGhpcy5vblJlbW92ZUZyb21UYWcuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmNyZWF0ZURldmljZVByb3BzID0gdGhpcy5jcmVhdGVEZXZpY2VQcm9wcy5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBkYXRhOiBbXSxcbiAgICAgICAgICAgIGNvbHVtbnM6IElETWFwcy5jcmVhdGUoT2JqZWN0LnZhbHVlcyhuZXcgRG9jUmVwb1RhYmxlQ29sdW1ucygpKSksXG4gICAgICAgICAgICBzZWxlY3RlZDogW10sXG4gICAgICAgICAgICBkb2NTaWRlYmFyVmlzaWJsZTogZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblJlZnJlc2hlZDogUmVmcmVzaGVkQ2FsbGJhY2sgPSByZXBvRG9jSW5mb3MgPT4gdGhpcy5vbkRhdGEocmVwb0RvY0luZm9zKTtcblxuICAgICAgICBjb25zdCByZXBvRG9jSW5mb3NQcm92aWRlciA9ICgpID0+IHRoaXMucHJvcHMucmVwb0RvY01ldGFNYW5hZ2VyLnJlcG9Eb2NJbmZvSW5kZXgudmFsdWVzKCk7XG4gICAgICAgIHRoaXMudGFnc1Byb3ZpZGVyID0gdGhpcy5wcm9wcy50YWdzO1xuXG4gICAgICAgIHRoaXMucGVyc2lzdGVuY2VMYXllck11dGF0b3JcbiAgICAgICAgICAgID0gbmV3IFBlcnNpc3RlbmNlTGF5ZXJNdXRhdG9yKHRoaXMucHJvcHMucmVwb0RvY01ldGFNYW5hZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5wZXJzaXN0ZW5jZUxheWVyUHJvdmlkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhZ3NQcm92aWRlcik7XG5cbiAgICAgICAgdGhpcy5kb2NSZXBvRmlsdGVycyA9IG5ldyBEb2NSZXBvRmlsdGVycyhvblJlZnJlc2hlZCwgcmVwb0RvY0luZm9zUHJvdmlkZXIpO1xuXG4gICAgICAgIGNvbnN0IG9uU2VsZWN0ZWQgPSAodGFnczogUmVhZG9ubHlBcnJheTxUYWdTdHI+KSA9PiB0aGlzLmRvY1JlcG9GaWx0ZXJzLm9uVGFnZ2VkKHRhZ3MubWFwKGN1cnJlbnQgPT4gVGFncy5jcmVhdGUoY3VycmVudCkpKTtcbiAgICAgICAgY29uc3Qgb25Ecm9wcGVkID0gKHRhZzogVGFnRGVzY3JpcHRvcikgPT4gdGhpcy5vbkRvY1RhZ2dlZChEcmFnZ2luZ1NlbGVjdGVkRG9jcy5nZXQoKSB8fCBbXSwgW3RhZ10pO1xuXG4gICAgICAgIHRoaXMudHJlZVN0YXRlID0gbmV3IFRyZWVTdGF0ZShvblNlbGVjdGVkLCBvbkRyb3BwZWQpO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgICAgIHRoaXMuaW5pdEFzeW5jKClcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gbG9nLmVycm9yKFwiQ291bGQgbm90IGluaXQ6IFwiLCBlcnIpKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdCgpIHtcblxuICAgICAgICAvLyBUT0RPOiB3aGVuIHdlIGdldCBhIE5FVyBwZXJzaXN0ZW5jZSBsYXllciB3ZSBwcm9iYWJseSBuZWVkIHRvIHJlbGVhc2VcbiAgICAgICAgLy8gdGhlIG9sZCBldmVudCBsaXN0ZW5lciBhcyB0aGUgY29tcG9uZW50IGlzIHN0aWxsIG1vdW50ZWQgYnV0IHRoZSBvbGRcbiAgICAgICAgLy8gcGVyc2lzdGVuY2UgbGF5ZXIgaGFzIG5vdyBnb25lIGF3YXkuXG5cbiAgICAgICAgY29uc3QgcGVyc2lzdGVuY2VMYXllciA9IHRoaXMucHJvcHMucGVyc2lzdGVuY2VMYXllclByb3ZpZGVyKCk7XG5cbiAgICAgICAgdGhpcy5yZWxlYXNlci5yZWdpc3RlcihwZXJzaXN0ZW5jZUxheWVyLmFkZEV2ZW50TGlzdGVuZXIoKCkgPT4gdGhpcy5yZWZyZXNoKCkpKTtcblxuICAgICAgICB0aGlzLnJlbGVhc2VyLnJlZ2lzdGVyKFxuICAgICAgICAgICAgUmVwb0RvY01ldGFMb2FkZXJzLmFkZFRocm90dGxpbmdFdmVudExpc3RlbmVyKHRoaXMucHJvcHMucmVwb0RvY01ldGFMb2FkZXIsICgpID0+IHRoaXMucmVmcmVzaCgpKSk7XG5cbiAgICAgICAgdGhpcy5yZWxlYXNlci5yZWdpc3RlcihcbiAgICAgICAgICAgIHRoaXMucHJvcHMucmVwb0RvY01ldGFMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudCA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIURvY1JlcG9TY3JlZW4uaGFzU2VudEluaXRBbmFseXRpY3MgJiYgZXZlbnQucHJvZ3Jlc3MucHJvZ3Jlc3MgPT09IDEwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXRJbml0QW5hbHl0aWNzKHRoaXMucHJvcHMucmVwb0RvY01ldGFNYW5hZ2VyLnJlcG9Eb2NJbmZvSW5kZXguc2l6ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgRG9jUmVwb1NjcmVlbi5oYXNTZW50SW5pdEFuYWx5dGljcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0QXN5bmMoKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICAgICAgLy8gRklYTUU6IHRoaXMgc2hvdWxkIGJlIGNvbXBsZXRlbHkgcmVwbGFjZWQgd2l0aCBjb250ZXh0XG5cbiAgICAgICAgY29uc3Qgc2V0dGluZ1Byb3ZpZGVyID0gYXdhaXQgU2V0dGluZ3NTdG9yZS5sb2FkKCk7XG5cbiAgICAgICAgbG9nLmluZm8oXCJTZXR0aW5ncyBsb2FkZWQ6IFwiLCBzZXR0aW5nUHJvdmlkZXIpO1xuXG4gICAgICAgIE9wdGlvbmFsLm9mKHNldHRpbmdQcm92aWRlcigpLmRvY3VtZW50UmVwb3NpdG9yeSlcbiAgICAgICAgICAgIC5tYXAoY3VycmVudCA9PiBjdXJyZW50LmNvbHVtbnMpXG4gICAgICAgICAgICAud2hlbihjb2x1bW5zID0+IHtcbiAgICAgICAgICAgICAgICBsb2cuaW5mbyhcIkxvYWRlZCBjb2x1bW5zIGZyb20gc2V0dGluZ3M6IFwiLCBjb2x1bW5zKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsuLi50aGlzLnN0YXRlLCBjb2x1bW5zfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgZW1pdEluaXRBbmFseXRpY3MobnJEb2NzOiBudW1iZXIpIHtcblxuICAgICAgICAvLyBUT0RPOiBtb3ZlIHNvbWUgb2YgdGhlc2UgYW5hbHl0aWNzIGludG8gdGhlIG1haW4gUmVwb2FpdG9yeUFwcC50c3guXG5cbiAgICAgICAgQW5hbHl0aWNzLnRyYWl0cyh7J25yRG9jcyc6IG5yRG9jc30pO1xuXG4gICAgICAgIGNvbnN0IHBlcnNpc3RlbmNlTGF5ZXJUeXBlID0gdGhpcy5wcm9wcy5wZXJzaXN0ZW5jZUxheWVyQ29udHJvbGxlci5jdXJyZW50VHlwZSgpO1xuXG4gICAgICAgIC8vIEFuYWx5dGljcy5ldmVudCh7Y2F0ZWdvcnk6ICdkb2N1bWVudC1yZXBvc2l0b3J5JywgYWN0aW9uOiBgZG9jcy1sb2FkZWQtJHtwZXJzaXN0ZW5jZUxheWVyVHlwZX0tJHtuckRvY3N9YH0pO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkRvY1RhZ2dlZChyZXBvRG9jSW5mb3M6IFJlYWRvbmx5QXJyYXk8UmVwb0RvY0luZm8+LFxuICAgICAgICAgICAgICAgICAgICAgICB0YWdzOiBSZWFkb25seUFycmF5PFRhZz4pIHtcblxuICAgICAgICBjb25zdCBkb1RhZyA9IGFzeW5jIChyZXBvRG9jSW5mbzogUmVwb0RvY0luZm8sIHRhZ3M6IFJlYWRvbmx5QXJyYXk8VGFnPikgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvRG9jTWV0YU1hbmFnZXIhLndyaXRlRG9jSW5mb1RhZ3MocmVwb0RvY0luZm8sIHRhZ3MpO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChjb25zdCByZXBvRG9jSW5mbyBvZiByZXBvRG9jSW5mb3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFncyA9IE9iamVjdC52YWx1ZXMocmVwb0RvY0luZm8udGFncyB8fCB7fSk7XG4gICAgICAgICAgICBjb25zdCBlZmZlY3RpdmVUYWdzID0gVGFncy51bmlvbihleGlzdGluZ1RhZ3MsIHRhZ3MgfHwgW10pO1xuXG4gICAgICAgICAgICBkb1RhZyhyZXBvRG9jSW5mbywgZWZmZWN0aXZlVGFncylcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IGxvZy5lcnJvcihlcnIpKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIG9uUmVtb3ZlRnJvbVRhZyhyYXdUYWc6IFRhZywgcmVwb0RvY0luZm9zOiBSZWFkb25seUFycmF5PFJlcG9Eb2NJbmZvPikge1xuXG4gICAgICAgIGZvciAoY29uc3QgcmVwb0RvY0luZm8gb2YgcmVwb0RvY0luZm9zKSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ1RhZ3MgPSBPYmplY3QudmFsdWVzKHJlcG9Eb2NJbmZvLnRhZ3MgfHwge30pO1xuICAgICAgICAgICAgY29uc3QgbmV3VGFncyA9IFRhZ3MuZGlmZmVyZW5jZShleGlzdGluZ1RhZ3MsIFtyYXdUYWddKTtcblxuICAgICAgICAgICAgdGhpcy5vbkRvY1RhZ2dlZChbcmVwb0RvY0luZm9dLCBuZXdUYWdzKVxuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByaXZhdGUgb25NdWx0aURlbGV0ZWQoKSB7XG4gICAgICAgIGNvbnN0IHJlcG9Eb2NJbmZvcyA9IHRoaXMuZ2V0U2VsZWN0ZWQoKTtcbiAgICAgICAgdGhpcy5vbkRvY0RlbGV0ZVJlcXVlc3RlZChyZXBvRG9jSW5mb3MpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYXJTZWxlY3RlZCgpIHtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoey4uLnRoaXMuc3RhdGUsIHNlbGVjdGVkOiBbXX0pO1xuICAgICAgICB9LCAxKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2VsZWN0ZWQoKTogUmVhZG9ubHlBcnJheTxSZXBvRG9jSW5mbz4ge1xuXG4gICAgICAgIGlmICghIHRoaXMucmVhY3RUYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzb2x2ZWRTdGF0ZTogSVJlc29sdmVkU3RhdGUgPSB0aGlzLnJlYWN0VGFibGUhLmdldFJlc29sdmVkU3RhdGUoKTtcblxuICAgICAgICBjb25zdCB7c29ydGVkRGF0YX0gPSByZXNvbHZlZFN0YXRlO1xuXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IChyZXNvbHZlZFN0YXRlLnBhZ2UpICogcmVzb2x2ZWRTdGF0ZS5wYWdlU2l6ZTtcblxuICAgICAgICBjb25zdCByZXN1bHQ6IFJlcG9Eb2NJbmZvW10gPVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZFxuICAgICAgICAgICAgICAgIC5tYXAoc2VsZWN0ZWRJZHggPT4gc29ydGVkRGF0YVtvZmZzZXQgKyBzZWxlY3RlZElkeF0pXG4gICAgICAgICAgICAgICAgLmZpbHRlcihpdGVtID0+IGlzUHJlc2VudChpdGVtKSlcbiAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4gaXRlbS5fb3JpZ2luYWwpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJvdyh2aWV3SW5kZXg6IG51bWJlcik6IFJlcG9Eb2NJbmZvIHtcbiAgICAgICAgY29uc3QgcmVzb2x2ZWRTdGF0ZTogSVJlc29sdmVkU3RhdGUgPSB0aGlzLnJlYWN0VGFibGUhLmdldFJlc29sdmVkU3RhdGUoKTtcbiAgICAgICAgY29uc3Qge3NvcnRlZERhdGF9ID0gcmVzb2x2ZWRTdGF0ZTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gKHJlc29sdmVkU3RhdGUucGFnZSkgKiByZXNvbHZlZFN0YXRlLnBhZ2VTaXplO1xuICAgICAgICBjb25zdCBpZHggPSBvZmZzZXQgKyB2aWV3SW5kZXg7XG4gICAgICAgIHJldHVybiBzb3J0ZWREYXRhW2lkeF0uX29yaWdpbmFsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWxlY3RSb3coc2VsZWN0ZWRJZHg6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiBSZWFjdC5Nb3VzZUV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgdHlwZTogU2VsZWN0Um93VHlwZSkge1xuXG4gICAgICAgIHNlbGVjdGVkSWR4ID0gTnVtYmVycy50b051bWJlcihzZWxlY3RlZElkeCk7XG5cbiAgICAgICAgLy8gdGhlcmUgYXJlIHJlYWxseSBvbmx5IHRocmVlIHN0cmF0ZWdpZXNcbiAgICAgICAgLy9cbiAgICAgICAgLy8gLSBvbmU6IHNlbGVjdCBPTkUgaXRlbSBhbmQgdW5zZWxlY3QgdGhlIHByZXZpb3VzIGl0ZW0ocykuICBUaGlzIGlzIGRvbmUgd2hlbiB3ZSBoYXZlXG4gICAgICAgIC8vICAgICAgICBhIHNpbmdsZSBjbGljayBvbiBhbiBpdGVtLiAgSXQgYWx3YXlzIHNlbGVjdHMgaXQgYW5kIG5ldmVyIGRlLXNlbGVjdHMgaXQuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIC0gYWRkIHRoZSBuZXcgc2VsZWN0ZWRJbmRleCB0byB0aGUgbGlzdCBvZiBjdXJyZW50bHkgc2VsZWN0ZWQgaXRlbXMuXG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgLSBGSVhNRTogcmVhbGx5IHdoYXQgdGhpcyBpcyBpcyBqdXN0IHNlbGVjdC1vbmUgYnV0IHdlIGxlYXZlIHRoZVxuICAgICAgICAvLyAgICAgcHJldmlvdXMgaXRlbXMgaW4gcGxhY2UgYW5kIHBlcmZvcm0gbm8gbXV0YXRpb24gb24gdGhlbS4uLlxuXG4gICAgICAgIC8vIC0gdG9nZ2xlOiB1c2VkIHdoZW4gdGhlIHR5cGUgaXMgJ2NoZWNrYm94JyBiZWNhdXNlIHdlJ3JlIG9ubHkgdG9nZ2xpbmdcbiAgICAgICAgLy8gICB0aGUgc2VsZWN0aW9uIG9mIHRoYXQgb25lIGl0ZW1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gLSBub25lOiBkbyBub3RoaW5nLiAgdGhpcyBpcyB1c2VkIHdoZW4gdGhlIGNvbnRleHQgbWVudSBpcyBiZWluZyB1c2VkIGFuZCBubyBhZGRpdGlvbmFsXG4gICAgICAgIC8vICAgICAgICAgaXRlbXMgYXJlIGJlaW5nIGNoYW5nZWQuXG5cbiAgICAgICAgdHlwZSBTZWxlY3Rpb25TdHJhdGVneSA9ICdvbmUnIHwgJ3JhbmdlJyB8ICd0b2dnbGUnIHwgJ25vbmUnO1xuXG4gICAgICAgIHR5cGUgU2VsZWN0ZWRSb3dzID0gUmVhZG9ubHlBcnJheTxudW1iZXI+O1xuXG4gICAgICAgIGNvbnN0IGNvbXB1dGVTdHJhdGVneSA9ICgpOiBTZWxlY3Rpb25TdHJhdGVneSA9PiB7XG5cbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd0b2dnbGUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NsaWNrJykge1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmdldE1vZGlmaWVyU3RhdGUoXCJTaGlmdFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3JhbmdlJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuZ2V0TW9kaWZpZXJTdGF0ZShcIkNvbnRyb2xcIikgfHwgZXZlbnQuZ2V0TW9kaWZpZXJTdGF0ZShcIk1ldGFcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd0b2dnbGUnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NvbnRleHQnKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZC5pbmNsdWRlcyhzZWxlY3RlZElkeCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdub25lJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICdvbmUnO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZG9TdHJhdGVneVJhbmdlID0gKCk6IFNlbGVjdGVkUm93cyA9PiB7XG5cbiAgICAgICAgICAgIC8vIHNlbGVjdCBhIHJhbmdlXG5cbiAgICAgICAgICAgIGxldCBtaW46IG51bWJlciA9IDA7XG4gICAgICAgICAgICBsZXQgbWF4OiBudW1iZXIgPSAwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc29ydGVkID0gWy4uLnRoaXMuc3RhdGUuc2VsZWN0ZWRdLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICAgICAgICAgICAgICBtaW4gPSBBcnJheXMuZmlyc3Qoc29ydGVkKSE7XG4gICAgICAgICAgICAgICAgbWF4ID0gQXJyYXlzLmxhc3Qoc29ydGVkKSE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gWy4uLk51bWJlcnMucmFuZ2UoTWF0aC5taW4obWluLCBzZWxlY3RlZElkeCksXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KG1heCwgc2VsZWN0ZWRJZHgpKV07XG5cbiAgICAgICAgICAgIHJldHVybiBzZWxlY3RlZDtcblxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGRvU3RyYXRlZ3lUb2dnbGUgPSAoKTogU2VsZWN0ZWRSb3dzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkID0gWy4uLnRoaXMuc3RhdGUuc2VsZWN0ZWRdO1xuXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQuaW5jbHVkZXMoc2VsZWN0ZWRJZHgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNldEFycmF5cy5kaWZmZXJlbmNlKHNlbGVjdGVkLCBbc2VsZWN0ZWRJZHhdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNldEFycmF5cy51bmlvbihzZWxlY3RlZCwgW3NlbGVjdGVkSWR4XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkb1N0cmF0ZWd5T25lID0gKCk6IFNlbGVjdGVkUm93cyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gW3NlbGVjdGVkSWR4XTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkb1N0cmF0ZWd5ID0gKCk6IFNlbGVjdGVkUm93cyB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0cmF0ZWd5ID0gY29tcHV0ZVN0cmF0ZWd5KCk7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwib25lXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb1N0cmF0ZWd5T25lKCk7XG4gICAgICAgICAgICAgICAgY2FzZSBcInJhbmdlXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb1N0cmF0ZWd5UmFuZ2UoKTtcbiAgICAgICAgICAgICAgICBjYXNlIFwidG9nZ2xlXCI6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb1N0cmF0ZWd5VG9nZ2xlKCk7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm5vbmVcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gZG9TdHJhdGVneSgpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Li4udGhpcy5zdGF0ZSwgc2VsZWN0ZWR9KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHVibGljIG9uU2VsZWN0ZWQoc2VsZWN0ZWQ6IFJlYWRvbmx5QXJyYXk8bnVtYmVyPikge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgLi4udGhpcy5zdGF0ZSwgc2VsZWN0ZWQgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVEZXZpY2VQcm9wcygpOiBkZXZpY2VzLkRldmljZVByb3BzIHtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gcmV0dXJuIHtcbiAgICAgICAgLy8gICAgIC4uLnRoaXMuc3RhdGUsXG4gICAgICAgIC8vICAgICByZWxhdGVkVGFnc01hbmFnZXI6IHRoaXMucHJvcHMucmVwb0RvY01ldGFNYW5hZ2VyIS5yZWxhdGVkVGFnc01hbmFnZXIsXG4gICAgICAgIC8vICAgICBzeW5jaHJvbml6aW5nRG9jTG9hZGVyOiB0aGlzLnN5bmNocm9uaXppbmdEb2NMb2FkZXIsXG4gICAgICAgIC8vICAgICB0YWdzUHJvdmlkZXI6IHRoaXMucHJvcHMudGFncyxcbiAgICAgICAgLy8gICAgIHdyaXRlRG9jSW5mb1RhZ3M6IChyZXBvRG9jSW5mbywgdGFncykgPT4gdGhpcy5wcm9wcy5yZXBvRG9jTWV0YU1hbmFnZXIhLndyaXRlRG9jSW5mb1RhZ3MocmVwb0RvY0luZm8sIHRhZ3MpLFxuICAgICAgICAvLyAgICAgZGVsZXRlRG9jSW5mbzogcmVwb0RvY0luZm8gPT4gdGhpcy5wcm9wcy5yZXBvRG9jTWV0YU1hbmFnZXIuZGVsZXRlRG9jTWV0YShyZXBvRG9jSW5mbyksXG4gICAgICAgIC8vICAgICB3cml0ZURvY0luZm9UaXRsZTogKHJlcG9Eb2NJbmZvLCB0aXRsZSkgPT4gdGhpcy5wcm9wcy5yZXBvRG9jTWV0YU1hbmFnZXIud3JpdGVEb2NJbmZvVGl0bGUocmVwb0RvY0luZm8sIHRpdGxlKSxcbiAgICAgICAgLy8gICAgIHdyaXRlRG9jSW5mbzogZG9jSW5mbyA9PiB0aGlzLnByb3BzLnJlcG9Eb2NNZXRhTWFuYWdlci53cml0ZURvY0luZm8oZG9jSW5mbyksXG4gICAgICAgIC8vICAgICByZWZyZXNoOiAoKSA9PiB0aGlzLnJlZnJlc2goKSxcbiAgICAgICAgLy8gICAgIG9uRG9jRGVsZXRlUmVxdWVzdGVkOiByZXBvRG9jSW5mb3MgPT4gdGhpcy5vbkRvY0RlbGV0ZVJlcXVlc3RlZChyZXBvRG9jSW5mb3MpLFxuICAgICAgICAvLyAgICAgb25Eb2NEZWxldGVkOiByZXBvRG9jSW5mb3MgPT4gdGhpcy5vbkRvY0RlbGV0ZWQocmVwb0RvY0luZm9zKSxcbiAgICAgICAgLy8gICAgIG9uRG9jU2V0VGl0bGU6IChyZXBvRG9jSW5mbywgdGl0bGUpID0+IHRoaXMub25Eb2NTZXRUaXRsZShyZXBvRG9jSW5mbywgdGl0bGUpLFxuICAgICAgICAvLyAgICAgb25Eb2NUYWdnZWQ6IHRoaXMub25Eb2NUYWdnZWQsXG4gICAgICAgIC8vICAgICBvbk11bHRpRGVsZXRlZDogKCkgPT4gdGhpcy5vbk11bHRpRGVsZXRlZCgpLFxuICAgICAgICAvLyAgICAgc2VsZWN0Um93OiB0aGlzLnNlbGVjdFJvdyxcbiAgICAgICAgLy8gICAgIG9uU2VsZWN0ZWQ6IHNlbGVjdGVkID0+IHRoaXMub25TZWxlY3RlZChzZWxlY3RlZCksXG4gICAgICAgIC8vICAgICBvblJlYWN0VGFibGU6IHJlYWN0VGFibGUgPT4gdGhpcy5yZWFjdFRhYmxlID0gcmVhY3RUYWJsZSxcbiAgICAgICAgLy8gICAgIG9uRHJhZ1N0YXJ0OiBldmVudCA9PiB0aGlzLm9uRHJhZ1N0YXJ0KGV2ZW50KSxcbiAgICAgICAgLy8gICAgIG9uRHJhZ0VuZDogKCkgPT4gdGhpcy5vbkRyYWdFbmQoKSxcbiAgICAgICAgLy8gICAgIGZpbHRlcnM6IHRoaXMuZG9jUmVwb0ZpbHRlcnMuZmlsdGVycyxcbiAgICAgICAgLy8gICAgIGdldFNlbGVjdGVkOiAoKSA9PiB0aGlzLmdldFNlbGVjdGVkKCksXG4gICAgICAgIC8vICAgICBnZXRSb3c6ICh2aWV3SW5kZXgpID0+IHRoaXMuZ2V0Um93KHZpZXdJbmRleCksXG4gICAgICAgIC8vICAgICBvblJlbW92ZUZyb21Gb2xkZXI6IChmb2xkZXIsIHJlcG9Eb2NJbmZvcykgPT4gdGhpcy5vblJlbW92ZUZyb21UYWcoZm9sZGVyLCByZXBvRG9jSW5mb3MpLFxuICAgICAgICAvLyAgICAgLy8gcGVyc2lzdGVuY2VMYXllck11dGF0b3I6IG51bGwhLFxuICAgICAgICAvLyAgICAgdHJlZVN0YXRlOiB0aGlzLnRyZWVTdGF0ZSxcbiAgICAgICAgLy8gICAgIC8vIHRhZ3M6IHRoaXMucHJvcHMudGFncygpXG4gICAgICAgIC8vIH07XG5cbiAgICAgICAgcmV0dXJuIG51bGwhO1xuXG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlcigpIHtcblxuICAgICAgICBjb25zdCB0YWdzUHJvdmlkZXIgPSB0aGlzLnByb3BzLnRhZ3M7XG5cbiAgICAgICAgY29uc3QgZGV2aWNlUHJvcHMgPSB0aGlzLmNyZWF0ZURldmljZVByb3BzKCk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxGaXhlZE5hdiBpZD1cImRvYy1yZXBvc2l0b3J5XCI+XG5cbiAgICAgICAgICAgICAgICA8UmVwb3NpdG9yeVRvdXIvPlxuICAgICAgICAgICAgICAgIDxoZWFkZXI+XG5cbiAgICAgICAgICAgICAgICAgICAgPFJlcG9IZWFkZXIgdG9nZ2xlPXsoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIiNmb2xkZXJzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBjb2xvcj1cImNsZWFyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhcyBmYS1iYXJzXCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJzaXN0ZW5jZUxheWVyUHJvdmlkZXI9e3RoaXMucHJvcHMucGVyc2lzdGVuY2VMYXllclByb3ZpZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJzaXN0ZW5jZUxheWVyQ29udHJvbGxlcj17dGhpcy5wcm9wcy5wZXJzaXN0ZW5jZUxheWVyQ29udHJvbGxlcn0vPlxuXG4gICAgICAgICAgICAgICAgICAgIDxNVUlQYXBlclRvb2xiYXIgaWQ9XCJoZWFkZXItZmlsdGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b21cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nPXsxfT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERvY1JlcG9CdXR0b25CYXIgLz5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpbkxlZnQ6ICdhdXRvJ319PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKjxEb2NSZXBvRmlsdGVyQmFyIG9uVG9nZ2xlRmxhZ2dlZE9ubHk9e3ZhbHVlID0+IHRoaXMub25Ub2dnbGVGbGFnZ2VkT25seSh2YWx1ZSl9Ki99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgICAgIG9uVG9nZ2xlRmlsdGVyQXJjaGl2ZWQ9e3ZhbHVlID0+IHRoaXMub25Ub2dnbGVGaWx0ZXJBcmNoaXZlZCh2YWx1ZSl9Ki99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgICAgIG9uRmlsdGVyQnlUaXRsZT17KHRpdGxlKSA9PiB0aGlzLm9uRmlsdGVyQnlUaXRsZSh0aXRsZSl9Ki99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgICAgIHJlZnJlc2hlcj17KCkgPT4gdGhpcy5yZWZyZXNoKCl9Ki99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgICAgIGZpbHRlcmVkVGFncz17dGhpcy5kb2NSZXBvRmlsdGVycy5maWx0ZXJzLmZpbHRlcmVkVGFnc30qL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qICAgICAgICAgICAgICAgICAgZG9jU2lkZWJhclZpc2libGU9e3RoaXMuc3RhdGUuZG9jU2lkZWJhclZpc2libGV9Ki99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgICAgIG9uRG9jU2lkZWJhclZpc2libGU9e3Zpc2libGUgPT4gdGhpcy5vbkRvY1NpZGViYXJWaXNpYmxlKHZpc2libGUpfSovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogICAgICAgICAgICAgICAgICByaWdodD17Ki99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZC1ub25lLXBob25lIGQtbm9uZS10YWJsZXRcIiovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7d2hpdGVTcGFjZTogJ25vd3JhcCcsIG1hcmdpblRvcDogJ2F1dG8nLCBtYXJnaW5Cb3R0b206ICdhdXRvJ319PiovfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgICAgICA8RG9jUmVwb1RhYmxlRHJvcGRvd24gaWQ9XCJ0YWJsZS1kcm9wZG93blwiKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz17T2JqZWN0LnZhbHVlcyh0aGlzLnN0YXRlLmNvbHVtbnMpfSovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0ZWRDb2x1bW5zPXsoc2VsZWN0ZWRDb2x1bW5zKSA9PiB0aGlzLm9uU2VsZWN0ZWRDb2x1bW5zKHNlbGVjdGVkQ29sdW1ucyl9Lz4qL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qICAgICAgICAgICAgICAgPC9kaXY+Ki99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiAgICAgICAgICAgfSovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyovPiovfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L01VSVBhcGVyVG9vbGJhcj5cblxuICAgICAgICAgICAgICAgICAgICA8TWVzc2FnZUJhbm5lci8+XG5cbiAgICAgICAgICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICAgICAgICAgIDxSb3V0ZXIgey4uLmRldmljZVByb3BzfS8+XG5cbiAgICAgICAgICAgICAgICA8RGV2aWNlUm91dGVyIHBob25lPXs8ZGV2aWNlcy5QaG9uZUFuZFRhYmxldCB7Li4uZGV2aWNlUHJvcHN9Lz59XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWJsZXQ9ezxkZXZpY2VzLlBob25lQW5kVGFibGV0IHsuLi5kZXZpY2VQcm9wc30vPn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2t0b3A9ezxkZXZpY2VzLkRlc2t0b3Agey4uLmRldmljZVByb3BzfS8+fS8+XG5cbiAgICAgICAgICAgICAgICA8Rml4ZWROYXYuRm9vdGVyPlxuXG4gICAgICAgICAgICAgICAgICAgIDxEZXZpY2VSb3V0ZXIuSGFuZGhlbGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8QWRkQ29udGVudC5IYW5kaGVsZC8+XG4gICAgICAgICAgICAgICAgICAgIDwvRGV2aWNlUm91dGVyLkhhbmRoZWxkPlxuXG4gICAgICAgICAgICAgICAgICAgIDxSZXBvRm9vdGVyLz5cbiAgICAgICAgICAgICAgICA8L0ZpeGVkTmF2LkZvb3Rlcj5cblxuICAgICAgICAgICAgPC9GaXhlZE5hdj5cblxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25EcmFnU3RhcnQoZXZlbnQ6IERyYWdFdmVudCkge1xuXG4gICAgICAgIGNvbnN0IGNvbmZpZ3VyZURyYWdJbWFnZSA9ICgpID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE86IHRoaXMgYWN0dWFsbHkgRE9FUyBOT1Qgd29yayBidXQgaXQncyBhIGJldHRlciBlZmZlY3QgdGhhbiB0aGVcbiAgICAgICAgICAgIC8vIGRlZmF1bHQgYW5kIGEgbG90IGxlc3MgY29uZnVzaW5nLiAgSW4gdGhlIGZ1dHVyZSB3ZSBzaG91bGQgbWlncmF0ZVxuICAgICAgICAgICAgLy8gdG8gc2hvd2luZyB0aGUgdGh1bWJuYWlsIG9mIHRoZSBkb2Mgb25jZSB3ZSBoYXZlIHRoaXMgZmVhdHVyZVxuICAgICAgICAgICAgLy8gaW1wbGVtZW50ZWQuXG5cbiAgICAgICAgICAgIGNvbnN0IHNyYzogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgICAgICAvLyBodHRwczovL2tyeW9nZW5peC5vcmcvY29kZS9icm93c2VyL2N1c3RvbS1kcmFnLWltYWdlLmh0bWxcbiAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2ZlciEuc2V0RHJhZ0ltYWdlKHNyYywgMCwgMCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uZmlndXJlRHJhZ0ltYWdlKCk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmdldFNlbGVjdGVkKCk7XG4gICAgICAgIERyYWdnaW5nU2VsZWN0ZWREb2NzLnNldChzZWxlY3RlZCk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIG9uRHJhZ0VuZCgpIHtcbiAgICAgICAgRHJhZ2dpbmdTZWxlY3RlZERvY3MuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uRG9jRGVsZXRlUmVxdWVzdGVkKHJlcG9Eb2NJbmZvczogUmVhZG9ubHlBcnJheTxSZXBvRG9jSW5mbz4pIHtcblxuICAgICAgICAvLyBGSVhNRSBsZWdhY3kgY3JhcFxuICAgICAgICBEaWFsb2dzLmNvbmZpcm0oe1xuICAgICAgICAgICAgdGl0bGU6IFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGVzZSBkb2N1bWVudChzKT9cIixcbiAgICAgICAgICAgIHN1YnRpdGxlOiBcIlRoaXMgaXMgYSBwZXJtYW5lbnQgb3BlcmF0aW9uIGFuZCBjYW4ndCBiZSB1bmRvbmUuICBBbGwgYXNzb2NpYXRlZCBhbm5vdGF0aW9ucyB3aWxsIGFsc28gYmUgcmVtb3ZlZC5cIixcbiAgICAgICAgICAgIG9uQ2FuY2VsOiBOVUxMX0ZVTkNUSU9OLFxuICAgICAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgICAgICBvbkNvbmZpcm06ICgpID0+IHRoaXMub25Eb2NEZWxldGVkKHJlcG9Eb2NJbmZvcyksXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkRvY1NpZGViYXJWaXNpYmxlKGRvY1NpZGViYXJWaXNpYmxlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoey4uLnRoaXMuc3RhdGUsIGRvY1NpZGViYXJWaXNpYmxlfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkRvY0RlbGV0ZWQocmVwb0RvY0luZm9zOiBSZWFkb25seUFycmF5PFJlcG9Eb2NJbmZvPikge1xuXG4gICAgICAgIGNvbnN0IGRvRGVsZXRlcyA9IGFzeW5jICgpID0+IHtcblxuICAgICAgICAgICAgY29uc3Qgc3RhdHMgPSB7XG4gICAgICAgICAgICAgICAgc3VjY2Vzc2VzOiAwLFxuICAgICAgICAgICAgICAgIGZhaWx1cmVzOiAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0ZWQoKTtcblxuICAgICAgICAgICAgY29uc3QgcHJvZ3Jlc3NUcmFja2VyID0gbmV3IFByb2dyZXNzVHJhY2tlcih7dG90YWw6IHJlcG9Eb2NJbmZvcy5sZW5ndGgsIGlkOiAnZGVsZXRlJ30pO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlcG9Eb2NJbmZvIG9mIHJlcG9Eb2NJbmZvcykge1xuXG4gICAgICAgICAgICAgICAgbG9nLmluZm8oXCJEZWxldGluZyBkb2N1bWVudDogXCIsIHJlcG9Eb2NJbmZvKTtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXBvRG9jTWV0YU1hbmFnZXIuZGVsZXRlRG9jSW5mbyhyZXBvRG9jSW5mbyk7XG4gICAgICAgICAgICAgICAgICAgICsrc3RhdHMuc3VjY2Vzc2VzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcblxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgKytzdGF0cy5mYWlsdXJlcztcbiAgICAgICAgICAgICAgICAgICAgbG9nLmVycm9yKFwiQ291bGQgbm90IGRlbGV0ZSBkb2M6IFwiICwgZSk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBwcm9ncmVzc1RyYWNrZXIuaW5jcigpO1xuICAgICAgICAgICAgICAgICAgICBQcm9ncmVzc01lc3NhZ2VzLmJyb2FkY2FzdChwcm9ncmVzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3RlZCgpO1xuXG4gICAgICAgICAgICBpZiAoc3RhdHMuZmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBGSVhNRSBsZWdhY3kgY3JhcFxuICAgICAgICAgICAgICAgIFRvYXN0ZXIuc3VjY2VzcyhgJHtzdGF0cy5zdWNjZXNzZXN9IGRvY3VtZW50cyBzdWNjZXNzZnVsbHkgZGVsZXRlZC5gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRklYTUUgbGVnYWN5IGNyYXBcbiAgICAgICAgICAgICAgICBUb2FzdGVyLmVycm9yKGBGYWlsZWQgdG8gZGVsZXRlICR7c3RhdHMuZmFpbHVyZXN9IHdpdGggJHtzdGF0cy5zdWNjZXNzZXN9IHN1Y2Nlc3NmdWwuYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBkb0RlbGV0ZXMoKVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBsb2cuZXJyb3IoXCJVbmFibGUgdG8gZGVsZXRlIGZpbGVzOiBcIiwgZXJyKSk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIG9uRG9jU2V0VGl0bGUocmVwb0RvY0luZm86IFJlcG9Eb2NJbmZvLCB0aXRsZTogc3RyaW5nKSB7XG5cbiAgICAgICAgLy8gQW5hbHl0aWNzLmV2ZW50KHtjYXRlZ29yeTogJ3VzZXInLCBhY3Rpb246ICdzZXQtZG9jLXRpdGxlJ30pO1xuXG4gICAgICAgIGxvZy5pbmZvKFwiU2V0dGluZyBkb2MgdGl0bGU6IFwiICwgdGl0bGUpO1xuXG4gICAgICAgIHRoaXMucHJvcHMucmVwb0RvY01ldGFNYW5hZ2VyLndyaXRlRG9jSW5mb1RpdGxlKHJlcG9Eb2NJbmZvLCB0aXRsZSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gbG9nLmVycm9yKFwiQ291bGQgbm90IHdyaXRlIGRvYyB0aXRsZTogXCIsIGVycikpO1xuXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvblNlbGVjdGVkQ29sdW1ucyhjb2x1bW5zOiBSZWFkb25seUFycmF5PExpc3RPcHRpb25UeXBlPikge1xuXG4gICAgICAgIC8vIEFuYWx5dGljcy5ldmVudCh7Y2F0ZWdvcnk6ICd1c2VyJywgYWN0aW9uOiAnc2VsZWN0ZWQtY29sdW1ucyd9KTtcblxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICAgICAgICBjb25zdCBjb2x1bW5zX21hcCA9IElETWFwcy5jcmVhdGUoY29sdW1ucyk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsuLi50aGlzLnN0YXRlLCBjb2x1bW5zOiBjb2x1bW5zX21hcH0pO1xuICAgICAgICB9LCAxKTtcblxuICAgICAgICBTZXR0aW5nc1N0b3JlLmxvYWQoKVxuICAgICAgICAgICAgLnRoZW4oKHNldHRpbmdzUHJvdmlkZXIpID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZXR0aW5ncyA9IHNldHRpbmdzUHJvdmlkZXIoKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzOiBTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uY3VycmVudFNldHRpbmdzLFxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudFJlcG9zaXRvcnk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnNfbWFwXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgU2V0dGluZ3NTdG9yZS53cml0ZShzZXR0aW5ncylcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBsb2cuZXJyb3IoZXJyKSk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IGxvZy5lcnJvcihcIkNvdWxkIG5vdCBsb2FkIHNldHRpbmdzOiBcIiwgZXJyKSk7XG5cbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIG9uRmlsdGVyQnlUaXRsZSh0aXRsZTogc3RyaW5nKSB7XG4gICAgICAgIFByZWNvbmRpdGlvbnMuYXNzZXJ0U3RyaW5nKHRpdGxlLCAndGl0bGUnKTtcbiAgICAgICAgLy8gQW5hbHl0aWNzLmV2ZW50KHtjYXRlZ29yeTogJ3VzZXInLCBhY3Rpb246ICdmaWx0ZXItYnktdGl0bGUnfSk7XG4gICAgICAgIHRoaXMuZG9jUmVwb0ZpbHRlcnMub25GaWx0ZXJCeVRpdGxlKHRpdGxlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZnJlc2goKSB7XG4gICAgICAgIC8vIHRoaXMgYXBwbGllcyB0aGUgZmlsdGVycyBhbmQgdGhlbiBjYWxscyBkb1JlZnJlc2guLi5cbiAgICAgICAgdGhpcy5kb2NSZXBvRmlsdGVycy5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybSB0aGUgYWN0dWFsIHJlZnJlc2guXG4gICAgICovXG4gICAgcHJpdmF0ZSBvbkRhdGEoZGF0YTogUmVhZG9ubHlBcnJheTxSZXBvRG9jSW5mbz4pIHtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcblxuICAgICAgICAgICAgLy8gVGhlIHJlYWN0IHRhYmxlIHdpbGwgbm90IHVwZGF0ZSB3aGVuIEkgY2hhbmdlIHRoZSBzdGF0ZSBmcm9tXG4gICAgICAgICAgICAvLyB3aXRoaW4gdGhlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAuLi50aGlzLnN0YXRlLFxuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LCAxKTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgb25Ub2dnbGVGbGFnZ2VkT25seSh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmRvY1JlcG9GaWx0ZXJzLm9uVG9nZ2xlRmxhZ2dlZE9ubHkodmFsdWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25Ub2dnbGVGaWx0ZXJBcmNoaXZlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmRvY1JlcG9GaWx0ZXJzLm9uVG9nZ2xlRmlsdGVyQXJjaGl2ZWQodmFsdWUpO1xuICAgIH1cblxufVxuXG5pbnRlcmZhY2UgSVByb3BzIHtcblxuICAgIHJlYWRvbmx5IHBlcnNpc3RlbmNlTGF5ZXJQcm92aWRlcjogTGlzdGVuYWJsZVBlcnNpc3RlbmNlTGF5ZXJQcm92aWRlcjtcblxuICAgIHJlYWRvbmx5IHBlcnNpc3RlbmNlTGF5ZXJDb250cm9sbGVyOiBQZXJzaXN0ZW5jZUxheWVyQ29udHJvbGxlcjtcblxuICAgIHJlYWRvbmx5IHVwZGF0ZWREb2NJbmZvRXZlbnREaXNwYXRjaGVyOiBJRXZlbnREaXNwYXRjaGVyPElEb2NJbmZvPjtcblxuICAgIHJlYWRvbmx5IHJlcG9Eb2NNZXRhTWFuYWdlcjogUmVwb0RvY01ldGFNYW5hZ2VyO1xuXG4gICAgcmVhZG9ubHkgcmVwb0RvY01ldGFMb2FkZXI6IFJlcG9Eb2NNZXRhTG9hZGVyO1xuXG4gICAgcmVhZG9ubHkgdGFnczogKCkgPT4gUmVhZG9ubHlBcnJheTxUYWdEZXNjcmlwdG9yPjtcblxuICAgIHJlYWRvbmx5IGRvY1JlcG86IERvY1JlcG9SZW5kZXJQcm9wcztcblxufVxuXG5pbnRlcmZhY2UgSVN0YXRlIHtcbiAgICByZWFkb25seSBkYXRhOiBSZWFkb25seUFycmF5PFJlcG9Eb2NJbmZvPjtcbiAgICByZWFkb25seSBjb2x1bW5zOiBEb2NSZXBvVGFibGVDb2x1bW5zTWFwO1xuICAgIHJlYWRvbmx5IHNlbGVjdGVkOiBSZWFkb25seUFycmF5PG51bWJlcj47XG4gICAgcmVhZG9ubHkgZG9jU2lkZWJhclZpc2libGU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGhlIHR5cGUgb2YgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIHJvdyBzZWxlY3Rpb24uICBFaXRoZXIgYSBub3JtYWwgY2xpY2ssIGEgY29udGV4dCBtZW51IGNsaWNrIChyaWdodCBjbGljaykgb3JcbiAqIGEgY2hlY2tib3ggZm9yIHNlbGVjdGluZyBtdWx0aXBsZS5cbiAqL1xuZXhwb3J0IHR5cGUgU2VsZWN0Um93VHlwZSA9ICdjbGljaycgfCAnY29udGV4dCcgfCAnY2hlY2tib3gnO1xuXG5pbnRlcmZhY2UgVGFibGVJdGVtIHtcbiAgICByZWFkb25seSBfb3JpZ2luYWw6IFJlcG9Eb2NJbmZvO1xufVxuXG5pbnRlcmZhY2UgSVJlc29sdmVkU3RhdGUge1xuICAgIHJlYWRvbmx5IHNvcnRlZERhdGE6IFJlYWRvbmx5QXJyYXk8VGFibGVJdGVtPjtcbiAgICByZWFkb25seSBwYWdlOiBudW1iZXI7XG4gICAgcmVhZG9ubHkgcGFnZVNpemU6IG51bWJlcjtcbn1cbiJdfQ==