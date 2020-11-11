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
exports.PrioritizedSplashes = void 0;
const React = __importStar(require("react"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const PrioritizedComponentManager_1 = require("../../../../web/js/ui/prioritized/PrioritizedComponentManager");
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
const SplashLifecycle_1 = require("../splash2/SplashLifecycle");
const log = Logger_1.Logger.create();
const MIN_DELAY = TimeDurations_1.TimeDurations.toMillis('15m');
const prioritizedComponentRefs = [];
class PrioritizedSplashes extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            lastUpdated: 0
        };
        this.doUpdate()
            .catch(err => log.error("Unable to update: ", err));
    }
    render() {
        if (this.state.datastoreOverview) {
            return (React.createElement(PrioritizedComponentManager_1.PrioritizedComponentManager, { prioritizedComponentRefs: prioritizedComponentRefs, datastoreOverview: this.state.datastoreOverview }));
        }
        else {
            return React.createElement("div", null);
        }
    }
    doUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const persistenceLayer = yield this.props.persistenceLayerManager.getAsync();
                const datastore = persistenceLayer.datastore;
                const datastoreOverview = yield datastore.overview();
                if (datastoreOverview) {
                    this.setState({
                        datastoreOverview,
                        lastUpdated: Date.now()
                    });
                    log.info("Datastore overview updated");
                }
            }
            finally {
                this.scheduleNextUpdate();
            }
        });
    }
    scheduleNextUpdate() {
        const delay = SplashLifecycle_1.SplashLifecycle.computeDelay();
        const effectiveDelay = Math.max(delay || MIN_DELAY, MIN_DELAY);
        log.debug("Scheduling next updated: ", { delay, effectiveDelay });
        setTimeout(() => {
            this.doUpdate()
                .catch(err => log.error("Unable to do update: ", err));
        }, effectiveDelay);
    }
}
exports.PrioritizedSplashes = PrioritizedSplashes;
//# sourceMappingURL=PrioritizedSplashes.js.map