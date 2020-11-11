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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrioritizedComponentManager = void 0;
const React = __importStar(require("react"));
const SplashLifecycle_1 = require("../../../../apps/repository/js/splash2/SplashLifecycle");
const LifecycleEvents_1 = require("../util/LifecycleEvents");
const LocalPrefs_1 = require("../../util/LocalPrefs");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Numbers_1 = require("polar-shared/src/util/Numbers");
const log = Logger_1.Logger.create();
class PrioritizedComponentManager extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const NullComponent = () => {
            return (React.createElement("div", null));
        };
        if (!LocalPrefs_1.LocalPrefs.isMarked(LifecycleEvents_1.LifecycleEvents.TOUR_TERMINATED)) {
            return React.createElement(NullComponent, null);
        }
        const datastoreOverview = this.props.datastoreOverview;
        const canShow = SplashLifecycle_1.SplashLifecycle.canShow();
        const sorted = [...this.props.prioritizedComponentRefs]
            .filter(current => current.priority(datastoreOverview) !== undefined)
            .sort((o1, o2) => Numbers_1.Numbers.compare(o1.priority(datastoreOverview), o2.priority(datastoreOverview)) * -1);
        log.debug("Remaining prioritized splashes: ", sorted);
        if (sorted.length === 0 || document.location.hash !== '') {
            return React.createElement(NullComponent, null);
        }
        const prioritizedComponentRef = sorted[0];
        SplashLifecycle_1.SplashLifecycle.markShown();
        return prioritizedComponentRef.create();
    }
}
exports.PrioritizedComponentManager = PrioritizedComponentManager;
//# sourceMappingURL=PrioritizedComponentManager.js.map