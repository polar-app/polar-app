"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIElevation = exports.useElevationBackground2 = exports.useElevationBackground = exports.useElevations = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../react/ReactUtils");
const styles_1 = require("@material-ui/core/styles");
const grey_1 = __importDefault(require("@material-ui/core/colors/grey"));
const clsx_1 = __importDefault(require("clsx"));
function useElevations() {
    const theme = styles_1.useTheme();
    return {
        0: {
            default: theme.palette.background.default,
            highlighted: '#2b2b2b'
        },
        1: {
            default: '#262626',
            highlighted: '#363636'
        },
        2: {
            default: theme.palette.background.paper,
            highlighted: '#3b3b3b'
        }
    };
}
exports.useElevations = useElevations;
function useElevationBackground(elevation) {
    const elevations = useElevations();
    return elevations[elevation];
}
exports.useElevationBackground = useElevationBackground;
function useElevationBackground2(elevation) {
    const theme = styles_1.useTheme();
    if (theme.palette.type === 'dark') {
        switch (elevation) {
            case 0:
                return theme.palette.background.default;
            case 1:
                return grey_1.default[800];
            case 2:
                return grey_1.default[700];
        }
    }
    else {
        switch (elevation) {
            case 0:
                return theme.palette.background.default;
            case 1:
                return grey_1.default[300];
            case 2:
                return grey_1.default[400];
        }
    }
}
exports.useElevationBackground2 = useElevationBackground2;
exports.MUIElevation = ReactUtils_1.deepMemo((props) => {
    const elevation = useElevationBackground(props.elevation);
    const backgroundColor = props.highlighted ? elevation.highlighted : elevation.default;
    return (react_1.default.createElement("div", { className: clsx_1.default(['mui-elevation', props.className]), style: Object.assign({ backgroundColor }, props.style) }, props.children));
});
//# sourceMappingURL=MUIElevation.js.map