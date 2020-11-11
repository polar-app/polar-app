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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const styles_1 = require("@material-ui/core/styles");
const MockTags_1 = require("./MockTags");
const MUITagInputControls_1 = require("../../../apps/repository/js/MUITagInputControls");
const LinearProgress_1 = __importDefault(require("@material-ui/core/LinearProgress"));
const TagNodes_1 = require("../../js/tags/TagNodes");
const MUIRepositoryRoot_1 = require("../../js/mui/MUIRepositoryRoot");
const react_dom_1 = __importDefault(require("react-dom"));
const react_teleporter_1 = require("react-teleporter");
const Functions_1 = require("polar-shared/src/util/Functions");
const material_ui_dropzone_1 = require("material-ui-dropzone");
exports.App = () => {
    const [theme, setTheme] = react_1.useState({
        typography: {
            htmlFontSize: 12,
            fontSize: 12
        },
        palette: {
            type: "dark"
        }
    });
    const toggleDarkTheme = () => {
        const newPaletteType = theme.palette.type === "light" ? "dark" : "light";
        setTheme({
            palette: {
                type: newPaletteType
            }
        });
    };
    const muiTheme = styles_1.createMuiTheme(theme);
    const tags = MockTags_1.MockTags.create();
    const tagOptions = tags.map(MUITagInputControls_1.MUITagInputControls.toAutocompleteOption);
    const relatedOptionsCalculator = () => {
        return tagOptions.slice(1, 3);
    };
    const changeTheme = () => {
        console.log("light");
        toggleDarkTheme();
    };
    function createTagDescriptor(tag, count) {
        return {
            id: tag,
            label: tag,
            count,
            members: []
        };
    }
    const tagDescriptors = [
        createTagDescriptor('hello', 101),
        createTagDescriptor('world', 101),
    ];
    const root = TagNodes_1.TagNodes.createTagsRoot(tagDescriptors);
    function provider() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({ value: 'hello' });
                }, 1000);
            });
        });
    }
    const Foo = (props) => {
        return (React.createElement("div", null, props.value));
    };
    const CompA = () => {
        react_1.useEffect(() => console.log("A"));
        return (React.createElement(React.Fragment, null,
            React.createElement(LinearProgress_1.default, { style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: 1,
                    width: '100%'
                } }),
            React.createElement("div", null, "A")));
    };
    const CompB = () => {
        react_1.useEffect(() => console.log("B"));
        return React.createElement("div", null, "B");
    };
    const CompC = () => {
        react_1.useEffect(() => console.log("C"));
        return React.createElement("div", null, "C");
    };
    const HeaderContext = React.createContext(undefined);
    function useHeaderContext() {
        return React.useContext(HeaderContext);
    }
    const HeaderRight = (props) => {
        const right = document.getElementById('header-right');
        if (!right) {
            throw new Error("No right header bar");
        }
        return react_dom_1.default.createPortal(props.children, right);
    };
    const HeaderChild = () => {
        return (React.createElement(HeaderRight, null,
            React.createElement("div", null, "this is some stuff on the right.")));
    };
    const teleporter = react_teleporter_1.createTeleporter();
    return (React.createElement(MUIRepositoryRoot_1.MUIRepositoryRoot, null,
        React.createElement(material_ui_dropzone_1.DropzoneDialog, { open: true, onSave: Functions_1.NULL_FUNCTION, acceptedFiles: ['image/jpeg', 'image/png', 'image/bmp'], showPreviews: true, maxFileSize: 5000000, onClose: Functions_1.NULL_FUNCTION })));
};
//# sourceMappingURL=App.js.map