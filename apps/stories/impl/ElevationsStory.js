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
exports.ElevationsStory = void 0;
const React = __importStar(require("react"));
const MUIElevation_1 = require("../../../web/js/mui/MUIElevation");
const ElevationExample = (props) => {
    const backgroundElevation = MUIElevation_1.useElevationBackground(props.elevation);
    return (React.createElement(React.Fragment, null,
        React.createElement(MUIElevation_1.MUIElevation, { style: {
                margin: '15px',
                padding: '10px'
            }, elevation: props.elevation },
            React.createElement("div", null,
                props.elevation,
                " default: ",
                backgroundElevation.default)),
        React.createElement(MUIElevation_1.MUIElevation, { style: {
                margin: '15px',
                padding: '10px'
            }, elevation: props.elevation, highlighted: true },
            React.createElement("div", null,
                props.elevation,
                " highlighted: ",
                backgroundElevation.highlighted))));
};
const elevations = [0, 1, 2];
const ElevationsList = () => {
    return (React.createElement("div", { style: {
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column'
        } }, elevations.map(current => (React.createElement(ElevationExample, { key: current, elevation: current })))));
};
exports.ElevationsStory = () => {
    return (React.createElement(ElevationsList, null));
};
//# sourceMappingURL=ElevationsStory.js.map