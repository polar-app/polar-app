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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInitializer = void 0;
const AnalyticsInitializer_1 = require("../../analytics/AnalyticsInitializer");
const Gestures_1 = require("../../ui/Gestures");
const ExternalNavigationBlock_1 = require("../../electron/navigation/ExternalNavigationBlock");
const UIModes_1 = require("../../ui/uimodes/UIModes");
const PlatformStyles_1 = require("../../ui/PlatformStyles");
const AppOrigin_1 = require("../AppOrigin");
const SimpleReactor_1 = require("../../reactor/SimpleReactor");
const AuthHandler_1 = require("./auth_handler/AuthHandler");
const UpdatesController_1 = require("../../auto_updates/UpdatesController");
const ProgressService_1 = require("../../ui/progress_bar/ProgressService");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Version_1 = require("polar-shared/src/util/Version");
const PDFModernTextLayers_1 = require("polar-pdf/src/pdf/PDFModernTextLayers");
const Platforms_1 = require("polar-shared/src/util/Platforms");
const ReactDOM = __importStar(require("react-dom"));
const LoadingSplash_1 = require("../../ui/loading_splash/LoadingSplash");
const React = __importStar(require("react"));
const Tracer_1 = require("polar-shared/src/util/Tracer");
const Functions_1 = require("polar-shared/src/util/Functions");
const MailingList_1 = require("./auth_handler/MailingList");
const log = Logger_1.Logger.create();
class AppInitializer {
    static init(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { persistenceLayerManager } = opts;
            console.time("AppInitializer.init");
            const syncBarProgress = new SimpleReactor_1.SimpleReactor();
            log.info("Running with Polar version: " + Version_1.Version.get());
            AnalyticsInitializer_1.AnalyticsInitializer.doInit();
            renderLoadingSplash();
            Gestures_1.PinchToZoom.disable();
            ExternalNavigationBlock_1.ExternalNavigationBlock.set(true);
            const persistenceLayerProvider = () => persistenceLayerManager.get();
            const persistenceLayerController = persistenceLayerManager;
            UIModes_1.UIModes.register();
            PlatformStyles_1.PlatformStyles.assign();
            AppOrigin_1.AppOrigin.configure();
            PDFModernTextLayers_1.PDFModernTextLayers.configure();
            const authHandler = AuthHandler_1.AuthHandlers.get();
            const platform = Platforms_1.Platforms.get();
            log.notice("Running on platform: " + Platforms_1.Platforms.toSymbol(platform));
            const app = {
                persistenceLayerManager, persistenceLayerProvider,
                persistenceLayerController, syncBarProgress,
            };
            new UpdatesController_1.UpdatesController().start();
            new ProgressService_1.ProgressService().start();
            function handleAuth() {
                return __awaiter(this, void 0, void 0, function* () {
                    const authStatus = yield Tracer_1.Tracer.async(authHandler.status(), 'AppInitializer.authHandler.status');
                    if (authStatus.type !== 'needs-authentication') {
                        MailingList_1.MailingList.subscribeWhenNecessary(authStatus)
                            .catch(err => console.error(err));
                        const onNeedsAuthentication = opts.onNeedsAuthentication || Functions_1.ASYNC_NULL_FUNCTION;
                        yield onNeedsAuthentication(app);
                    }
                });
            }
            handleAuth()
                .catch(err => log.error("Could not handle auth: ", err));
            console.timeEnd("AppInitializer.init");
            return app;
        });
    }
}
exports.AppInitializer = AppInitializer;
function getRootElement() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        throw new Error("No root element to which to render");
    }
    return rootElement;
}
function renderLoadingSplash() {
    const rootElement = getRootElement();
    ReactDOM.render(React.createElement(LoadingSplash_1.LoadingSplash, null), rootElement);
}
//# sourceMappingURL=AppInitializer.js.map