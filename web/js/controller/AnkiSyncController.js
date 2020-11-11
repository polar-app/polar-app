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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnkiSyncController = void 0;
const react_1 = __importDefault(require("react"));
const AnkiSyncEngine_1 = require("../apps/sync/framework/anki/AnkiSyncEngine");
const Analytics_1 = require("../analytics/Analytics");
const MUILogger_1 = require("../mui/MUILogger");
const ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
const PersistenceLayerApp_1 = require("../../../apps/repository/js/persistence_layer/PersistenceLayerApp");
const MUIDialogControllers_1 = require("../mui/dialogs/MUIDialogControllers");
const AnkiSyncError_1 = require("../apps/sync/framework/anki/AnkiSyncError");
const Functions_1 = require("polar-shared/src/util/Functions");
const MUILinkLoaderButton_1 = require("../mui/MUILinkLoaderButton");
exports.AnkiSyncController = react_1.default.memo(() => {
    const log = MUILogger_1.useLogger();
    const dialogManager = MUIDialogControllers_1.useDialogManager();
    const repoDocMetaManager = PersistenceLayerApp_1.useRepoDocMetaManager();
    const createDocMetaSuppliers = react_1.default.useCallback(() => {
        return repoDocMetaManager.repoDocInfoIndex.values().map(current => () => __awaiter(void 0, void 0, void 0, function* () { return current.docMeta; }));
    }, [repoDocMetaManager]);
    const onStartSync = react_1.default.useCallback(() => {
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                Analytics_1.Analytics.event({ category: 'anki', action: 'sync-started' });
                let nrTasks = 0;
                let nrFailedTasks = 0;
                const updateProgress = yield dialogManager.taskbar({ message: "Starting anki sync..." });
                try {
                    updateProgress({ value: 'indeterminate' });
                    const syncProgressListener = syncProgress => {
                        log.info("Sync progress: ", syncProgress);
                        syncProgress.taskResult.map(() => ++nrTasks);
                        syncProgress.taskResult
                            .filter(taskResult => taskResult.failed === true)
                            .map(() => ++nrFailedTasks);
                        updateProgress({
                            message: "Sending flashcards to Anki.",
                            value: syncProgress.percentage
                        });
                    };
                    const ankiSyncEngine = new AnkiSyncEngine_1.AnkiSyncEngine();
                    const docMetaSuppliers = createDocMetaSuppliers();
                    const pendingSyncJob = yield ankiSyncEngine.sync(docMetaSuppliers, syncProgressListener);
                    updateProgress({ value: 0 });
                    yield pendingSyncJob.start();
                    function finalNotifications() {
                        const message = `Anki sync complete. Completed ${nrTasks} with ${nrFailedTasks} failures.`;
                        updateProgress({
                            message,
                            value: 100
                        });
                        dialogManager.snackbar({ message });
                    }
                    finalNotifications();
                    Analytics_1.Analytics.event({ category: 'anki', action: 'sync-completed' });
                }
                finally {
                    updateProgress('terminate');
                }
            });
        }
        function handleError(err) {
            if (err instanceof AnkiSyncError_1.AnkiSyncError) {
                console.error("Could not sync to Anki: ", err);
                dialogManager.confirm({
                    type: 'error',
                    title: "Could not sync to Anki",
                    subtitle: (react_1.default.createElement(react_1.default.Fragment, null,
                        "We were unable to sync to Anki.  But don't worry - it's probably one of the following items:",
                        react_1.default.createElement("ul", null,
                            react_1.default.createElement("li", null, "Make sure Anki is running."),
                            react_1.default.createElement("li", null,
                                "Make sure you have the Anki Connect add-on installed.",
                                react_1.default.createElement("p", null,
                                    react_1.default.createElement(MUILinkLoaderButton_1.MUILinkLoaderButton, { href: "https://ankiweb.net/shared/info/2055492159", variant: "contained" }, "Install Anki Connect"))),
                            react_1.default.createElement("li", null, "Make sure you don't have a firewall preventing us from connecting to port 8765.")))),
                    noCancel: true,
                    onAccept: Functions_1.NULL_FUNCTION
                });
            }
            else {
                log.error("Could not sync to Anki: ", err);
            }
        }
        doAsync()
            .catch(handleError);
    }, [log, dialogManager, createDocMetaSuppliers]);
    const onMessageReceived = react_1.default.useCallback((event) => {
        switch (event.data.type) {
            case "start-anki-sync":
                log.info("AnkiSyncController: started");
                onStartSync();
                break;
        }
    }, [log, onStartSync]);
    const messageListener = react_1.default.useCallback((event) => onMessageReceived(event), [onMessageReceived]);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        console.log("START Listening for Anki sync messages");
        window.addEventListener("message", messageListener, false);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        console.log("STOP listening to Anki sync messages");
        window.removeEventListener("message", messageListener, false);
    });
    return null;
});
//# sourceMappingURL=AnkiSyncController.js.map