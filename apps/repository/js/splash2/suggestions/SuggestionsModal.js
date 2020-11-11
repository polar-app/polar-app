"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionsModal = void 0;
const react_1 = __importDefault(require("react"));
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const UserFeedback_1 = require("../../../../../web/js/telemetry/UserFeedback");
const Suggestions_1 = require("../../../../../web/js/ui/feedback/Suggestions");
const LocalPrefs_1 = require("../../../../../web/js/util/LocalPrefs");
const SplashKeys_1 = require("../SplashKeys");
const Version_1 = require("polar-shared/src/util/Version");
const MachineIDs_1 = require("polar-shared/src/util/MachineIDs");
class SuggestionsModal extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onSuggestion = this.onSuggestion.bind(this);
    }
    render() {
        const Description = () => react_1.default.createElement("p", null, "We need your help to improve Polar!  In your opinion what should we do to make it better? Please be specific as we really do read every one of these and there's a good chance your suggestion will be incorporated into a future version of Polar.");
        return (react_1.default.createElement(Suggestions_1.Suggestions, { category: "user-suggestions", title: "How should we improve Polar?", description: react_1.default.createElement(Description, null), onDone: text => this.onSuggestion(text) }));
    }
    onSuggestion(text) {
        const netPromoterScore = LocalPrefs_1.LocalPrefs.get(SplashKeys_1.SplashKeys.NET_PROMOTER_SCORE)
            .map(current => Number.parseInt(current))
            .map(current => current)
            .getOrNull();
        const version = Version_1.Version.get();
        const userFeedback = {
            machine: MachineIDs_1.MachineIDs.get(),
            text,
            netPromoterScore,
            created: ISODateTimeStrings_1.ISODateTimeStrings.create(),
            version
        };
        UserFeedback_1.UserFeedbacks.write(userFeedback)
            .catch(err => console.error("Unable to write user feedback: ", err));
    }
}
exports.SuggestionsModal = SuggestionsModal;
//# sourceMappingURL=SuggestionsModal.js.map