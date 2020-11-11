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
exports.MUIDialogController = exports.MUIDialogControllerContext = exports.NullDialogManager = void 0;
const Functions_1 = require("polar-shared/src/util/Functions");
const react_1 = __importStar(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const ConfirmDialog_1 = require("../../ui/dialogs/ConfirmDialog");
const PromptDialog_1 = require("../../ui/dialogs/PromptDialog");
const AutocompleteDialog_1 = require("../../ui/dialogs/AutocompleteDialog");
const SnackbarDialog_1 = require("../../ui/dialogs/SnackbarDialog");
const TaskbarDialog_1 = require("../../ui/dialogs/TaskbarDialog");
const Latch_1 = require("polar-shared/src/util/Latch");
const SelectDialog_1 = require("../../ui/dialogs/SelectDialog");
function nullDialog() {
    console.warn("WARNING using null dialog manager");
}
exports.NullDialogManager = {
    confirm: nullDialog,
    prompt: nullDialog,
    autocomplete: nullDialog,
    snackbar: nullDialog,
    taskbar: () => __awaiter(void 0, void 0, void 0, function* () { return Functions_1.NULL_FUNCTION; }),
    dialog: nullDialog,
    select: nullDialog,
};
function createKey() {
    return '' + Math.floor(Math.random() * 1000000);
}
const DialogHost = (props) => {
    const dialogElements = react_1.default.useRef([]);
    const registerDialogElement = react_1.default.useCallback((element) => {
        dialogElements.current = [...dialogElements.current, element];
    }, []);
    const [state, setState] = react_1.useState(() => {
        let iter = 0;
        function doIncr() {
            setState({
                iter: iter++
            });
        }
        const confirm = (confirmDialogProps) => {
            registerDialogElement(react_1.default.createElement(ConfirmDialog_1.ConfirmDialog, Object.assign({ key: createKey() }, confirmDialogProps)));
            doIncr();
        };
        const dialog = (confirmDialogProps) => {
            registerDialogElement(react_1.default.createElement(ConfirmDialog_1.ConfirmDialog, Object.assign({ key: createKey(), subtitle: confirmDialogProps.body }, confirmDialogProps)));
            doIncr();
        };
        const prompt = (promptDialogProps) => {
            registerDialogElement(react_1.default.createElement(PromptDialog_1.PromptDialog, Object.assign({ key: createKey() }, promptDialogProps)));
            doIncr();
        };
        const autocomplete = function (autocompleteProps) {
            registerDialogElement(react_1.default.createElement(AutocompleteDialog_1.AutocompleteDialog, Object.assign({ key: createKey() }, autocompleteProps)));
            doIncr();
        };
        const snackbar = function (snackbarProps) {
            registerDialogElement(react_1.default.createElement(SnackbarDialog_1.SnackbarDialog, Object.assign({ key: createKey() }, snackbarProps)));
            doIncr();
        };
        const taskbar = function (taskbarProps) {
            return __awaiter(this, void 0, void 0, function* () {
                const latch = new Latch_1.Latch();
                function onProgressCallback(callback) {
                    latch.resolve(callback);
                }
                const props = Object.assign(Object.assign({}, taskbarProps), { onProgressCallback });
                registerDialogElement(react_1.default.createElement(TaskbarDialog_1.TaskbarDialog, Object.assign({ key: createKey() }, props)));
                doIncr();
                return latch.get();
            });
        };
        const select = function (selectProps) {
            registerDialogElement(react_1.default.createElement(SelectDialog_1.SelectDialog, Object.assign({ key: createKey() }, selectProps)));
            doIncr();
        };
        const dialogManager = {
            confirm,
            prompt,
            autocomplete,
            snackbar,
            dialog,
            taskbar,
            select
        };
        setTimeout(() => props.onDialogManager(dialogManager), 1);
        return undefined;
    });
    if (state === undefined) {
        return null;
    }
    return (react_1.default.createElement(react_1.default.Fragment, null, dialogElements.current));
};
exports.MUIDialogControllerContext = react_1.default.createContext(exports.NullDialogManager);
exports.MUIDialogController = react_1.default.memo((props) => {
    const [dialogManager, setDialogManager] = react_1.useState();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(DialogHost, { onDialogManager: dialogManger => setDialogManager(dialogManger) }),
        dialogManager && (react_1.default.createElement(exports.MUIDialogControllerContext.Provider, { value: dialogManager }, props.children))));
}, react_fast_compare_1.default);
//# sourceMappingURL=MUIDialogController.js.map