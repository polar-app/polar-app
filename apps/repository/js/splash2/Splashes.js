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
exports.Splashes = void 0;
const React = __importStar(require("react"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const SplashEngine_1 = require("./SplashEngine");
const Version_1 = require("polar-shared/src/util/Version");
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
const NPSModal_1 = require("./nps/NPSModal");
const WhatsNewDialog_1 = require("./whats_new/WhatsNewDialog");
const SuggestionsModal_1 = require("./suggestions/SuggestionsModal");
const log = Logger_1.Logger.create();
class Splashes extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onWhatsNew = this.onWhatsNew.bind(this);
        this.onNetPromoter = this.onNetPromoter.bind(this);
        this.state = {
            splash: 'none'
        };
        this.init()
            .catch(err => log.error("Unable to init: ", err));
    }
    render() {
        switch (this.state.splash) {
            case 'none':
                return React.createElement("div", null);
            case 'net-promoter':
                return React.createElement(NPSModal_1.NPSModal, null);
            case 'suggestions':
                return React.createElement(SuggestionsModal_1.SuggestionsModal, null);
            case 'whats-new':
                return React.createElement(WhatsNewDialog_1.WhatsNewDialog, null);
        }
    }
    onWhatsNew() {
        this.setState(Object.assign(Object.assign({}, this.state), { splash: 'whats-new' }));
    }
    onNetPromoter() {
        this.setState(Object.assign(Object.assign({}, this.state), { splash: 'net-promoter' }));
    }
    onSuggestions() {
        this.setState(Object.assign(Object.assign({}, this.state), { splash: 'suggestions' }));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const userFacts = yield this.computeUserFacts();
            if (userFacts) {
                const splashEngine = new SplashEngine_1.DefaultSplashEngine(userFacts, {
                    onWhatsNew: () => this.onWhatsNew(),
                    onNetPromoter: () => this.onNetPromoter(),
                    onSuggestions: () => this.onSuggestions()
                });
                this.doUpdate(splashEngine);
            }
            else {
                log.warn("Unable to run splash engine due to no user facts");
            }
        });
    }
    doUpdate(splashEngine) {
        try {
            splashEngine.run();
        }
        finally {
            this.scheduleNextUpdate(splashEngine);
        }
    }
    computeUserFacts() {
        return __awaiter(this, void 0, void 0, function* () {
            const persistenceLayer = yield this.props.persistenceLayerManager.getAsync();
            const datastore = persistenceLayer.datastore;
            const datastoreOverview = yield datastore.overview();
            if (datastoreOverview) {
                const userFacts = {
                    datastoreCreated: datastoreOverview.created,
                    version: Version_1.Version.get()
                };
                return userFacts;
            }
            return undefined;
        });
    }
    scheduleNextUpdate(splashEngine) {
        const delay = TimeDurations_1.TimeDurations.toMillis('5m');
        setTimeout(() => {
            this.doUpdate(splashEngine);
        }, delay);
    }
}
exports.Splashes = Splashes;
//# sourceMappingURL=Splashes.js.map