"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAFileIcon = exports.FAHomeIcon = exports.FADatabaseIcon = exports.FATimesCircleIcon = exports.FACheckCircleIcon = exports.FAPlusIcon = exports.FATagIcon = exports.FADiscordIcon = exports.FAChromeIcon = exports.FASquareIcon = exports.FACheckSquareIcon = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@material-ui/core");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faCheckSquare_1 = require("@fortawesome/free-solid-svg-icons/faCheckSquare");
const faCoffee_1 = require("@fortawesome/free-solid-svg-icons/faCoffee");
const faTag_1 = require("@fortawesome/free-solid-svg-icons/faTag");
const faPlus_1 = require("@fortawesome/free-solid-svg-icons/faPlus");
const faCheckCircle_1 = require("@fortawesome/free-solid-svg-icons/faCheckCircle");
const faTimesCircle_1 = require("@fortawesome/free-solid-svg-icons/faTimesCircle");
const faSquare_1 = require("@fortawesome/free-regular-svg-icons/faSquare");
const faChrome_1 = require("@fortawesome/free-brands-svg-icons/faChrome");
const faDiscord_1 = require("@fortawesome/free-brands-svg-icons/faDiscord");
const faDatabase_1 = require("@fortawesome/free-solid-svg-icons/faDatabase");
const faHome_1 = require("@fortawesome/free-solid-svg-icons/faHome");
const faFile_1 = require("@fortawesome/free-solid-svg-icons/faFile");
const fontawesome_svg_core_1 = require("@fortawesome/fontawesome-svg-core");
const ReactUtils_1 = require("../react/ReactUtils");
fontawesome_svg_core_1.library.add(faCheckSquare_1.faCheckSquare, faCoffee_1.faCoffee, faTag_1.faTag, faPlus_1.faPlus, faCheckSquare_1.faCheckSquare, faDatabase_1.faDatabase, faTimesCircle_1.faTimesCircle, faSquare_1.faSquare, faChrome_1.faChrome, faDiscord_1.faDiscord);
const FASvgIcon = ReactUtils_1.deepMemo((props) => {
    return (react_1.default.createElement(core_1.SvgIcon, Object.assign({}, props),
        react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: props.icon })));
});
function createIcon(icon) {
    return ReactUtils_1.deepMemo((props) => (react_1.default.createElement(FASvgIcon, Object.assign({ icon: icon }, props))));
}
exports.FACheckSquareIcon = createIcon(faCheckSquare_1.faCheckSquare);
exports.FASquareIcon = createIcon(faSquare_1.faSquare);
exports.FAChromeIcon = createIcon(faChrome_1.faChrome);
exports.FADiscordIcon = createIcon(faDiscord_1.faDiscord);
exports.FATagIcon = createIcon(faTag_1.faTag);
exports.FAPlusIcon = createIcon(faPlus_1.faPlus);
exports.FACheckCircleIcon = createIcon(faCheckCircle_1.faCheckCircle);
exports.FATimesCircleIcon = createIcon(faTimesCircle_1.faTimesCircle);
exports.FADatabaseIcon = createIcon(faDatabase_1.faDatabase);
exports.FAHomeIcon = createIcon(faHome_1.faHome);
exports.FAFileIcon = createIcon(faFile_1.faFile);
//# sourceMappingURL=MUIFontAwesome.js.map