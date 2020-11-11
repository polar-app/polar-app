"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanIntervalToggle = exports.useActivePlanHandler = exports.useActivePlanIntervalFromLocation = void 0;
const PricingStore_1 = require("./PricingStore");
const react_1 = __importDefault(require("react"));
const ToggleButton_1 = __importDefault(require("@material-ui/lab/ToggleButton"));
const ToggleButtonGroup_1 = __importDefault(require("@material-ui/lab/ToggleButtonGroup"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper/Paper"));
const Devices_1 = require("polar-shared/src/util/Devices");
const react_router_dom_1 = require("react-router-dom");
const useStyles = makeStyles_1.default({
    button: {
        width: "20em",
    },
});
function useActivePlanIntervalFromLocation() {
    react_router_dom_1.useLocation();
    const hash = document.location.hash;
    if (hash === '#4year') {
        return '4year';
    }
    if (hash === '#month') {
        return 'month';
    }
    if (hash === '#year') {
        return 'year';
    }
    return 'month';
}
exports.useActivePlanIntervalFromLocation = useActivePlanIntervalFromLocation;
function useActivePlanIntervalRouter() {
    const interval = useActivePlanIntervalFromLocation();
    const { setInterval } = PricingStore_1.usePricingCallbacks();
    react_1.default.useEffect(() => {
        setInterval(interval);
    }, [interval, setInterval]);
}
function useActivePlanHandler() {
    const history = react_router_dom_1.useHistory();
    return react_1.default.useCallback((interval) => {
        history.push({
            hash: `${interval}`
        });
    }, [history]);
}
exports.useActivePlanHandler = useActivePlanHandler;
exports.PlanIntervalToggle = react_1.default.memo(() => {
    const classes = useStyles();
    useActivePlanIntervalRouter();
    const { interval } = PricingStore_1.usePricingStore(['interval']);
    const activePlanHandler = useActivePlanHandler();
    const orientation = Devices_1.Devices.isPhone() ? 'vertical' : 'horizontal';
    const handleChange = react_1.default.useCallback((event, newInterval) => {
        activePlanHandler(newInterval || 'month');
    }, [activePlanHandler]);
    return (react_1.default.createElement(Paper_1.default, { elevation: 1 },
        react_1.default.createElement(ToggleButtonGroup_1.default, { exclusive: true, orientation: orientation, value: interval || 'month', onChange: handleChange },
            react_1.default.createElement(ToggleButton_1.default, { className: classes.button, value: "month", "aria-label": "bold" }, "Monthly"),
            react_1.default.createElement(ToggleButton_1.default, { className: classes.button, value: "year", "aria-label": "bold" },
                react_1.default.createElement(Typography_1.default, null, "Yearly"),
                "\u00A0\u00A0",
                react_1.default.createElement(Typography_1.default, { color: "secondary" }, "One Month Free")),
            react_1.default.createElement(ToggleButton_1.default, { className: classes.button, value: "4year", "aria-label": "bold" },
                react_1.default.createElement(Typography_1.default, null, "4 Years"),
                "\u00A0\u00A0",
                react_1.default.createElement(Typography_1.default, { color: "secondary" }, "Save Over 40%")))));
});
//# sourceMappingURL=PlanIntervalToggle.js.map