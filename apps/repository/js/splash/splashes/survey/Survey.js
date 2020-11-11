"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Survey = exports.SURVEY_LINK = void 0;
const react_1 = __importDefault(require("react"));
const Splash_1 = require("../../Splash");
const SplitLayout_1 = require("../../../../../../web/js/ui/split_layout/SplitLayout");
const SplitLayoutRight_1 = require("../../../../../../web/js/ui/split_layout/SplitLayoutRight");
const CallToActionLink_1 = require("../components/CallToActionLink");
exports.SURVEY_LINK = 'https://kevinburton1.typeform.com/to/BuX1Ef';
class Survey extends react_1.default.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (react_1.default.createElement(Splash_1.Splash, { settingKey: this.props.settingKey },
            react_1.default.createElement(SplitLayout_1.SplitLayout, null,
                react_1.default.createElement(SplitLayout_1.SplitLayoutLeft, null,
                    react_1.default.createElement("h2", null, "What do you think of Polar?"),
                    react_1.default.createElement("p", { className: "h5" },
                        "Could you take ",
                        react_1.default.createElement("b", null, "2 minutes"),
                        " and answer 10 questions about your use of Polar?"),
                    react_1.default.createElement("p", { className: "text-center mt-4" },
                        react_1.default.createElement(CallToActionLink_1.CallToActionLink, { href: exports.SURVEY_LINK, eventCategory: 'splash-survey' }, "Provide Feedback")),
                    react_1.default.createElement("p", { className: "text-center text-muted" },
                        "We read ",
                        react_1.default.createElement("i", null, "every"),
                        " response and your feedback is critical to the success of Polar!")),
                react_1.default.createElement(SplitLayoutRight_1.SplitLayoutRight, null,
                    react_1.default.createElement("p", { className: "text-center m-2" },
                        react_1.default.createElement("i", { style: { fontSize: '200px' }, className: "text-primary fas fa-bullhorn" }))))));
    }
}
exports.Survey = Survey;
//# sourceMappingURL=Survey.js.map