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
exports.Feedback = void 0;
const React = __importStar(require("react"));
const LeftRightSplit_1 = require("../left_right_split/LeftRightSplit");
const Nav_1 = require("../util/Nav");
const Survey_1 = require("../../../../apps/repository/js/splash/splashes/survey/Survey");
const MessageBox_1 = require("../util/MessageBox");
const Analytics_1 = require("../../analytics/Analytics");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
class Feedback extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onFeedback = this.onFeedback.bind(this);
        this.onUnsure = this.onUnsure.bind(this);
        this.takeExtendedSurvey = this.takeExtendedSurvey.bind(this);
        this.state = {
            completed: false
        };
    }
    render() {
        const Description = () => {
            if (this.props.description) {
                return React.createElement("p", { className: "text-center" }, this.props.description);
            }
            else {
                return React.createElement("div", null);
            }
        };
        const UnsureButton = () => {
            if (this.props.unsure) {
                return React.createElement("div", null,
                    React.createElement(Button_1.default, { variant: "contained", onClick: () => this.onUnsure() }, "Not sure yet"));
            }
            else {
                return null;
            }
        };
        const FeedbackButton = (props) => {
            let background = props.background;
            if (this.state.completed) {
                background = '#D8D8D8';
            }
            return React.createElement(Button_1.default, { variant: "contained", disabled: this.state.completed, style: {
                    width: '2.5em',
                    height: '2.5em',
                    margin: '5px',
                    display: 'inline-block',
                    backgroundColor: background
                }, onClick: () => this.onFeedback(props.rating) },
                React.createElement("div", { className: "m-auto" }, props.rating));
        };
        const Thanks = () => {
            return React.createElement("div", { className: "text-center" },
                React.createElement("div", { className: "text-success m-1" },
                    React.createElement("i", { style: { fontSize: '75px' }, className: "fas fa-check-circle" })),
                React.createElement("h2", null, "Thanks for your feedback!"));
        };
        const ButtonTable = () => {
            const colorSet = new GroupedColorSet();
            return React.createElement("table", { className: "ml-auto mr-auto" },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { style: {
                                    display: 'block',
                                } },
                                React.createElement(FeedbackButton, { rating: 0, background: colorSet.button0 }),
                                React.createElement(FeedbackButton, { rating: 1, background: colorSet.button1 }),
                                React.createElement(FeedbackButton, { rating: 2, background: colorSet.button2 }),
                                React.createElement(FeedbackButton, { rating: 3, background: colorSet.button3 }),
                                React.createElement(FeedbackButton, { rating: 4, background: colorSet.button4 }),
                                React.createElement(FeedbackButton, { rating: 5, background: colorSet.button5 }),
                                React.createElement(FeedbackButton, { rating: 6, background: colorSet.button6 }),
                                React.createElement(FeedbackButton, { rating: 7, background: colorSet.button7 }),
                                React.createElement(FeedbackButton, { rating: 8, background: colorSet.button8 }),
                                React.createElement(FeedbackButton, { rating: 9, background: colorSet.button9 }),
                                React.createElement(FeedbackButton, { rating: 10, background: colorSet.button10 })))),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(LeftRightSplit_1.LeftRightSplit, { style: { marginLeft: '5px', marginRight: '5px' }, left: React.createElement("span", { style: { fontWeight: 'bold' } }, this.props.from), right: React.createElement("span", { style: { fontWeight: 'bold' } }, this.props.to) })))));
        };
        const FeedbackForm = () => {
            return React.createElement(MessageBox_1.MessageBox, null,
                React.createElement("h3", { className: "text-center" }, this.props.title),
                React.createElement("div", { className: "ml-auto mr-auto" },
                    React.createElement(Description, null)),
                React.createElement(ButtonTable, null),
                React.createElement("div", { className: "text-center mt-2" },
                    React.createElement(Button_1.default, { variant: "contained", onClick: () => this.takeExtendedSurvey() }, "Take Extended Survey")),
                this.props.footer);
        };
        if (this.state.completed) {
            return React.createElement("div", null);
        }
        else {
            return React.createElement(FeedbackForm, null);
        }
    }
    onFeedback(rating) {
        if (!this.props.noEvent) {
            Analytics_1.Analytics.event({
                category: this.props.category,
                action: `${rating}`,
            });
            console.log(`Sent feedback for category ${this.props.category}: ${rating}`);
        }
        this.markCompleted();
        if (this.props.onRated) {
            this.props.onRated(rating);
        }
    }
    takeExtendedSurvey() {
        Nav_1.Nav.openLinkWithNewTab(Survey_1.SURVEY_LINK);
        this.markCompleted();
    }
    onUnsure() {
        if (!this.props.noEvent) {
            Analytics_1.Analytics.event({
                category: this.props.category,
                action: `unsure`,
            });
            console.log(`Sent unsure feedback for category ${this.props.category}`);
        }
        this.markCompleted();
    }
    markCompleted() {
        this.setState({
            completed: true
        });
    }
}
exports.Feedback = Feedback;
class LinearColorSet {
    constructor() {
        this.button0 = "rgba(255, 0, 0, 1.0)";
        this.button1 = "rgba(255, 0, 0, 1.0)";
        this.button2 = "rgba(255, 0, 0, 0.8)";
        this.button3 = "rgba(255, 0, 0, 0.6)";
        this.button4 = "rgba(255, 0, 0, 0.4)";
        this.button5 = "rgba(255, 0, 0, 0.2)";
        this.button6 = "rgba(0, 255, 0, 0.2)";
        this.button7 = "rgba(0, 255, 0, 0.4)";
        this.button8 = "rgba(0, 255, 0, 0.6)";
        this.button9 = "rgba(0, 255, 0, 0.8)";
        this.button10 = "rgba(0, 255, 0, 1.0)";
    }
}
class GroupedColorSet {
    constructor() {
        this.button0 = "#CB5C45";
        this.button1 = "#CB5C45";
        this.button2 = "#CB5C45";
        this.button3 = "#CB5C45";
        this.button4 = "#CB5C45";
        this.button5 = "#CB5C45";
        this.button6 = "#CB5C45";
        this.button7 = "#EAC870";
        this.button8 = "#EAC870";
        this.button9 = "#3EC0B3";
        this.button10 = "#3EC0B3";
    }
}
//# sourceMappingURL=Feedback.js.map