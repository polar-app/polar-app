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
exports.JoyrideTours = void 0;
const React = __importStar(require("react"));
const SplitLayout_1 = require("../split_layout/SplitLayout");
const RepositoryTour_1 = require("../../apps/repository/RepositoryTour");
const SplitLayoutRight_1 = require("../split_layout/SplitLayoutRight");
class JoyrideTours {
    static createImageStep(step) {
        const Image = () => {
            if (typeof step.image === 'string') {
                return React.createElement("img", { src: step.image, style: RepositoryTour_1.Styles.SPLIT_BAR_IMG });
            }
            else {
                return React.createElement("div", null, step.image);
            }
        };
        return {
            target: step.target,
            title: step.title,
            disableBeacon: true,
            styles: {
                tooltip: {
                    width: '700px'
                }
            },
            content: React.createElement("div", null,
                React.createElement(SplitLayout_1.SplitLayout, null,
                    React.createElement(SplitLayout_1.SplitLayoutLeft, null, step.content),
                    React.createElement(SplitLayoutRight_1.SplitLayoutRight, null,
                        React.createElement(Image, null)))),
            placement: step.placement || 'bottom',
            hideBackButton: step.hideBackButton || false,
            spotlightClicks: step.spotlightClicks || false,
            autoNext: step.autoNext,
            disabled: step.disabled
        };
    }
}
exports.JoyrideTours = JoyrideTours;
//# sourceMappingURL=JoyrideTours.js.map