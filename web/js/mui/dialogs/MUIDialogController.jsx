"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDialogController = exports.MUIDialogControllerContext = exports.NullDialogManager = void 0;
var Functions_1 = require("polar-shared/src/util/Functions");
var react_1 = require("react");
var react_fast_compare_1 = require("react-fast-compare");
var ConfirmDialog_1 = require("../../ui/dialogs/ConfirmDialog");
var PromptDialog_1 = require("../../ui/dialogs/PromptDialog");
var AutocompleteDialog_1 = require("../../ui/dialogs/AutocompleteDialog");
var SnackbarDialog_1 = require("../../ui/dialogs/SnackbarDialog");
var TaskbarDialog_1 = require("../../ui/dialogs/TaskbarDialog");
var Latch_1 = require("polar-shared/src/util/Latch");
var SelectDialog_1 = require("../../ui/dialogs/SelectDialog");
function nullDialog() {
    console.warn("WARNING using null dialog manager");
}
exports.NullDialogManager = {
    confirm: nullDialog,
    prompt: nullDialog,
    autocomplete: nullDialog,
    snackbar: nullDialog,
    taskbar: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, Functions_1.NULL_FUNCTION];
    }); }); },
    dialog: nullDialog,
    select: nullDialog,
};
function createKey() {
    return '' + Math.floor(Math.random() * 1000000);
}
/**
 * Hosts the actual dialogs so that we don't ever re-render sub-components.
 */
var DialogHost = function (props) {
    var dialogElements = react_1.default.useRef([]);
    var registerDialogElement = react_1.default.useCallback(function (element) {
        dialogElements.current = __spreadArrays(dialogElements.current, [element]);
    }, []);
    // TODO we need a way to handle GCing the dialog boxes so they're removed
    var _a = react_1.useState(function () {
        var iter = 0;
        function doIncr() {
            setState({
                iter: iter++
            });
        }
        var confirm = function (confirmDialogProps) {
            registerDialogElement(<ConfirmDialog_1.ConfirmDialog key={createKey()} {...confirmDialogProps}/>);
            doIncr();
        };
        var dialog = function (confirmDialogProps) {
            registerDialogElement(<ConfirmDialog_1.ConfirmDialog key={createKey()} subtitle={confirmDialogProps.body} {...confirmDialogProps}/>);
            doIncr();
        };
        var prompt = function (promptDialogProps) {
            registerDialogElement(<PromptDialog_1.PromptDialog key={createKey()} {...promptDialogProps}/>);
            doIncr();
        };
        var autocomplete = function (autocompleteProps) {
            registerDialogElement(<AutocompleteDialog_1.AutocompleteDialog key={createKey()} {...autocompleteProps}/>);
            doIncr();
        };
        var snackbar = function (snackbarProps) {
            registerDialogElement(<SnackbarDialog_1.SnackbarDialog key={createKey()} {...snackbarProps}/>);
            doIncr();
        };
        // const dialog = function(dialogProps: IDialogProps) {
        //     registerDialogElement({
        //         type: 'dialog',
        //         props: dialogProps,
        //     });
        //     doIncr();
        // };
        var taskbar = function (taskbarProps) {
            return __awaiter(this, void 0, void 0, function () {
                function onProgressCallback(callback) {
                    latch.resolve(callback);
                }
                var latch, props;
                return __generator(this, function (_a) {
                    latch = new Latch_1.Latch();
                    props = __assign(__assign({}, taskbarProps), { onProgressCallback: onProgressCallback });
                    registerDialogElement(<TaskbarDialog_1.TaskbarDialog key={createKey()} {...props}/>);
                    doIncr();
                    return [2 /*return*/, latch.get()];
                });
            });
        };
        var select = function (selectProps) {
            registerDialogElement(<SelectDialog_1.SelectDialog key={createKey()} {...selectProps}/>);
            doIncr();
        };
        var dialogManager = {
            confirm: confirm,
            prompt: prompt,
            autocomplete: autocomplete,
            snackbar: snackbar,
            dialog: dialog,
            taskbar: taskbar,
            select: select
        };
        // WARN: not sure if this is the appropriate way to do this but we need
        // to have this run after the component renders and this way it can
        // continue
        setTimeout(function () { return props.onDialogManager(dialogManager); }, 1);
        return undefined;
    }), state = _a[0], setState = _a[1];
    if (state === undefined) {
        return null;
    }
    return (<>
            {dialogElements.current}
        </>);
};
exports.MUIDialogControllerContext = react_1.default.createContext(exports.NullDialogManager);
/**
 * Component to allow us to inject new components like snackbars, dialog boxes,
 * modals, etc but still use the react tree.
 */
exports.MUIDialogController = react_1.default.memo(function (props) {
    var _a = react_1.useState(), dialogManager = _a[0], setDialogManager = _a[1];
    return (<>

            <DialogHost onDialogManager={function (dialogManger) { return setDialogManager(dialogManger); }}/>

            {dialogManager && (<exports.MUIDialogControllerContext.Provider value={dialogManager}>
                    {props.children}
                </exports.MUIDialogControllerContext.Provider>)}

        </>);
}, react_fast_compare_1.default);
