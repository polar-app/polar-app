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
exports.LoginScreen = void 0;
const react_1 = __importStar(require("react"));
const Firebase_1 = require("../../../../web/js/firebase/Firebase");
const FirebaseUIAuth_1 = require("../../../../web/js/firebase/FirebaseUIAuth");
const ExternalNavigationBlock_1 = require("../../../../web/js/electron/navigation/ExternalNavigationBlock");
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const MUIButtonBar_1 = require("../../../../web/js/mui/MUIButtonBar");
const SignInSuccessURLs_1 = require("./SignInSuccessURLs");
const PolarSVGIcon_1 = require("../../../../web/js/ui/svg_icons/PolarSVGIcon");
const ProviderURLs_1 = require("./ProviderURLs");
exports.LoginScreen = react_1.default.memo((props) => {
    function doDownloadDesktop() {
        document.location.href = 'https://getpolarized.io/download.html?utm_source=getpolarized.io&utm_content=login-download-button&utm_medium=site';
    }
    function doInit() {
        ExternalNavigationBlock_1.ExternalNavigationBlock.set(false);
        Firebase_1.Firebase.init();
        const user = Firebase_1.Firebase.currentUser();
        if (!user) {
            const signInSuccessUrl = SignInSuccessURLs_1.SignInSuccessURLs.get();
            const providerURL = ProviderURLs_1.ProviderURLs.parse(document.location);
            const authOptions = Object.assign(Object.assign({}, props), { signInSuccessUrl, provider: providerURL.provider });
            FirebaseUIAuth_1.FirebaseUIAuth.login(authOptions);
        }
        else {
            console.log("Already authenticated as " + user.email);
        }
    }
    react_1.useEffect(() => {
        doInit();
    });
    return (react_1.default.createElement("div", { style: {
            display: 'flex',
            width: '100%',
            height: '100%'
        } },
        react_1.default.createElement(Paper_1.default, { style: {
                margin: 'auto',
                maxWidth: '450px',
                maxHeight: '500px',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            } },
            react_1.default.createElement("div", { style: { flexGrow: 1 } },
                react_1.default.createElement("div", { className: "text-center" },
                    react_1.default.createElement(PolarSVGIcon_1.PolarSVGIcon, { width: 175, height: 175 }),
                    react_1.default.createElement("h1", null, "Login to Polar")),
                react_1.default.createElement("div", { id: "firebaseui-auth-container", className: "p-1" })),
            react_1.default.createElement(MUIButtonBar_1.MUIButtonBar, { className: "mt-1 p-1", style: { justifyContent: 'flex-end' } }))));
});
//# sourceMappingURL=LoginScreen.js.map