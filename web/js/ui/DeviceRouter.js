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
exports.DeviceRouters = exports.DeviceRouter = void 0;
const React = __importStar(require("react"));
const Devices_1 = require("polar-shared/src/util/Devices");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
class DeviceRouter extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.device = Devices_1.Devices.get();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !react_fast_compare_1.default(this.props, nextProps);
    }
    render() {
        switch (this.device) {
            case "phone":
                return this.props.phone || this.props.handheld || null;
            case "tablet":
                return this.props.tablet || this.props.handheld || null;
            case "desktop":
                return this.props.desktop || null;
            default:
                return null;
        }
    }
}
exports.DeviceRouter = DeviceRouter;
DeviceRouter.Desktop = React.memo((props) => {
    if (Devices_1.Devices.isDesktop()) {
        return props.children;
    }
    else {
        return null;
    }
}, react_fast_compare_1.default);
DeviceRouter.Handheld = React.memo((props) => {
    if (Devices_1.Devices.isPhone() || Devices_1.Devices.isTablet()) {
        return props.children;
    }
    else {
        return null;
    }
}, react_fast_compare_1.default);
var DeviceRouters;
(function (DeviceRouters) {
    function createAccepts(acceptedDevices) {
        return React.memo((props) => {
            const device = Devices_1.Devices.get();
            if (acceptedDevices.includes(device)) {
                return props.children;
            }
            return null;
        });
    }
    DeviceRouters.createAccepts = createAccepts;
    function createRejects(rejectedDevices) {
        return React.memo((props) => {
            const device = Devices_1.Devices.get();
            if (!rejectedDevices.includes(device)) {
                return props.children;
            }
            return null;
        });
    }
    DeviceRouters.Handheld = createAccepts(['phone', 'tablet']);
    DeviceRouters.Phone = createAccepts(['phone']);
    DeviceRouters.Tablet = createAccepts(['tablet']);
    DeviceRouters.Desktop = createAccepts(['desktop']);
    DeviceRouters.NotHandheld = createRejects(['phone', 'tablet']);
    DeviceRouters.NotPhone = createRejects(['phone']);
    DeviceRouters.NotTablet = createRejects(['tablet']);
    DeviceRouters.NotDesktop = createRejects(['desktop']);
})(DeviceRouters = exports.DeviceRouters || (exports.DeviceRouters = {}));
//# sourceMappingURL=DeviceRouter.js.map