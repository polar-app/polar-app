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
const MockElevationComponent = () => {
    return (React.createElement("div", { style: { display: 'flex', flexGrow: 1 } },
        React.createElement(MUIElevation_1.MUIElevation, { elevation: 1 },
            React.createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                } },
                React.createElement("div", null, "sidebar with elevation 0"))),
        React.createElement(MUIElevation_1.MUIElevation, { elevation: 0, style: { flexGrow: 1 } },
            React.createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                } },
                React.createElement("div", null, "main content with elevation 0")))));
};
exports.ElevationsStory = () => {
    return (React.createElement(MockElevationComponent, null));
};
//# sourceMappingURL=ElevationsExampleUsageStory.js.map