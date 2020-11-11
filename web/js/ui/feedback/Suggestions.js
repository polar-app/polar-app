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
exports.Suggestions = void 0;
const React = __importStar(require("react"));
const TakeExtendedSurveyButton_1 = require("./TakeExtendedSurveyButton");
const Analytics_1 = require("../../analytics/Analytics");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Input_1 = __importDefault(require("@material-ui/core/Input"));
class Suggestions extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.value = "";
        this.onDone = this.onDone.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = {
            completed: false
        };
    }
    render() {
        const Description = () => {
            if (this.props.description) {
                return this.props.description;
            }
            else {
                return null;
            }
        };
        const Form = () => {
            return React.createElement("div", { style: {
                    position: 'fixed',
                    bottom: 25,
                    zIndex: 9999,
                    width: '100%'
                }, className: "" },
                React.createElement("div", { style: {
                        width: '600px',
                        backgroundColor: "var(--primary-background-color)"
                    }, className: "border rounded shadow p-3 ml-auto mr-auto" },
                    React.createElement("h3", null, this.props.title),
                    React.createElement("div", { className: "ml-auto mr-auto" },
                        React.createElement(Description, null)),
                    React.createElement(Input_1.default, { type: "textarea", onChange: event => this.value = event.target.value, style: { height: '8em' } }),
                    React.createElement("div", { className: "mt-2", style: { display: 'flex' } },
                        React.createElement("div", { className: "ml-auto" },
                            React.createElement(TakeExtendedSurveyButton_1.TakeExtendedSurveyButton, null),
                            React.createElement(Button_1.default, { variant: "contained", onClick: () => this.onCancel() }, "Cancel"),
                            React.createElement(Button_1.default, { color: "primary", variant: "contained", className: "ml-1", onClick: () => this.onDone() }, "Send Feedback")))));
        };
        if (this.state.completed) {
            return React.createElement("div", null);
        }
        else {
            return React.createElement(Form, null);
        }
    }
    onCancel() {
        if (!this.props.noEvent) {
            Analytics_1.Analytics.event({
                category: this.props.category,
                action: 'cancel-suggestion',
            });
        }
        this.markCompleted();
    }
    onDone() {
        if (!this.props.noEvent) {
            Analytics_1.Analytics.event({
                category: this.props.category,
                action: 'sent-suggestion',
            });
        }
        this.markCompleted();
        if (this.props.onDone) {
            this.props.onDone(this.value);
        }
    }
    markCompleted() {
        this.setState({
            completed: true
        });
    }
}
exports.Suggestions = Suggestions;
//# sourceMappingURL=Suggestions.js.map