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
exports.TakeExtendedSurveyButton = void 0;
const React = __importStar(require("react"));
const Nav_1 = require("../util/Nav");
const Survey_1 = require("../../../../apps/repository/js/splash/splashes/survey/Survey");
const Button_1 = __importDefault(require("@material-ui/core/Button/Button"));
class TakeExtendedSurveyButton extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onDone = this.onDone.bind(this);
        this.state = {
            completed: false
        };
    }
    render() {
        return (React.createElement(Button_1.default, { variant: "contained", onClick: () => this.onDone() }, "Take Extended Survey"));
    }
    onDone() {
        Nav_1.Nav.openLinkWithNewTab(Survey_1.SURVEY_LINK);
    }
}
exports.TakeExtendedSurveyButton = TakeExtendedSurveyButton;
//# sourceMappingURL=TakeExtendedSurveyButton.js.map