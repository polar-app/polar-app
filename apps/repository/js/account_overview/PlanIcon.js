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
exports.PlanIcon = void 0;
const React = __importStar(require("react"));
const Colors_1 = require("polar-shared/src/util/Colors");
const Check_1 = __importDefault(require("@material-ui/icons/Check"));
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
class Colors {
}
Colors.FREE = Colors_1.RGBs.create(0, 0, 0);
Colors.BRONZE = Colors_1.RGBs.create(205, 127, 50);
Colors.SILVER = Colors_1.RGBs.create(207, 207, 207);
Colors.GOLD = Colors_1.RGBs.create(252, 194, 0);
exports.PlanIcon = ReactUtils_1.deepMemo((props) => {
    const border = '2px solid black';
    const CheckWhenActive = () => {
        if (props.active) {
            return React.createElement(Check_1.default, null);
        }
        else {
            return null;
        }
    };
    return (React.createElement("div", { style: {
            display: 'flex',
            flexDirection: 'column'
        } },
        React.createElement("div", { className: "", style: {
                width: '50px',
                height: '50px',
                display: 'flex',
                boxSizing: 'border-box',
                borderRadius: '35px',
                border,
            } },
            React.createElement("div", { className: "m-auto" },
                React.createElement(CheckWhenActive, null))),
        React.createElement("div", { className: "ml-auto mr-auto text-md" }, props.level)));
});
//# sourceMappingURL=PlanIcon.js.map