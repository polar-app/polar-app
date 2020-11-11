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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewerScreen = exports.useAsyncWithError = void 0;
var react_1 = require("react");
var Reviewers2_1 = require("./Reviewers2");
var react_async_1 = require("react-async");
var Reviewer2_1 = require("./Reviewer2");
var MUIDialogControllers_1 = require("../../../../web/js/mui/dialogs/MUIDialogControllers");
var Functions_1 = require("polar-shared/src/util/Functions");
var FirestoreProvider_1 = require("../FirestoreProvider");
var MUIAsyncLoader_1 = require("../../../../web/js/mui/MUIAsyncLoader");
var ReviewerDialog2_1 = require("./ReviewerDialog2");
var react_fast_compare_1 = require("react-fast-compare");
var react_router_dom_1 = require("react-router-dom");
// TODO needs to be a dedicated function.
function useAsyncWithError(opts) {
    var dialogs = MUIDialogControllers_1.useDialogManager();
    var _a = react_async_1.useAsync(opts), data = _a.data, error = _a.error;
    if (error) {
        dialogs.confirm({
            title: "An error occurred.",
            subtitle: "We encountered an error: " + error.message,
            type: 'error',
            onAccept: Functions_1.NULL_FUNCTION,
        });
    }
    return data;
}
exports.useAsyncWithError = useAsyncWithError;
exports.ReviewerScreen = react_1.default.memo(function (props) {
    var firestoreContext = FirestoreProvider_1.useFirestore();
    var history = react_router_dom_1.useHistory();
    var _a = react_1.useState(true), open = _a[0], setOpen = _a[1];
    //
    // if (! firestoreContext) {
    //     return;
    // }
    var handleClose = react_1.default.useCallback(function () {
        setOpen(false);
        history.replace({ pathname: "/annotations", hash: "" });
    }, []);
    function provider() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Reviewers2_1.Reviewers2.create(__assign({ firestore: firestoreContext }, props))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    // TODO: suspend isn't being run here... we might need to migrate to a
    // store rather than prop drilling which is a pain.
    return (<ReviewerDialog2_1.ReviewerDialog2 className="reviewer" open={open} onClose={handleClose}>

            <MUIAsyncLoader_1.MUIAsyncLoader provider={provider} render={Reviewer2_1.Reviewer2} onReject={handleClose}/>

        </ReviewerDialog2_1.ReviewerDialog2>);
}, react_fast_compare_1.default);
