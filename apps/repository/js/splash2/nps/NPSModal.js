"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPSModal = void 0;
const react_1 = __importDefault(require("react"));
const Feedback_1 = require("../../../../../web/js/ui/feedback/Feedback");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const UserFeedback_1 = require("../../../../../web/js/telemetry/UserFeedback");
const SplashKeys_1 = require("../SplashKeys");
const LocalPrefs_1 = require("../../../../../web/js/util/LocalPrefs");
const Version_1 = require("polar-shared/src/util/Version");
const MachineIDs_1 = require("polar-shared/src/util/MachineIDs");
class NPSModal extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onRated = this.onRated.bind(this);
    }
    render() {
        return (react_1.default.createElement(Feedback_1.Feedback, { category: 'net-promoter-score', title: 'How likely are you to recommend Polar?', from: "Not likely", to: "Very likely", onRated: (rating) => this.onRated(rating) }));
    }
    onRated(rating) {
        LocalPrefs_1.LocalPrefs.set(SplashKeys_1.SplashKeys.NET_PROMOTER_SCORE, rating);
        const version = Version_1.Version.get();
        const userFeedback = {
            machine: MachineIDs_1.MachineIDs.get(),
            text: null,
            netPromoterScore: rating,
            created: ISODateTimeStrings_1.ISODateTimeStrings.create(),
            version
        };
        UserFeedback_1.UserFeedbacks.write(userFeedback)
            .catch(err => console.error("Unable to write user feedback: ", err));
    }
}
exports.NPSModal = NPSModal;
//# sourceMappingURL=NPSModal.js.map