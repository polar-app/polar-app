"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoginCallback = exports.useLogoutCallback = void 0;
const AccountActions_1 = require("./AccountActions");
const react_router_dom_1 = require("react-router-dom");
const MUIDialogControllers_1 = require("../mui/dialogs/MUIDialogControllers");
const MUILogger_1 = require("../mui/MUILogger");
function useLogoutCallback() {
    const history = react_router_dom_1.useHistory();
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const log = MUILogger_1.useLogger();
    return () => {
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const progressCallback = yield dialogs.taskbar({ message: "Going to logout.  Clearing your data... one sec." });
                progressCallback({ value: 'indeterminate' });
                yield AccountActions_1.AccountActions.logout();
                progressCallback({ value: 100 });
                dialogs.snackbar({
                    type: 'success',
                    message: "You've been logged out!  Thanks for using Polar!"
                });
                history.push('/login');
            });
        }
        doAsync().catch(err => log.error(err));
    };
}
exports.useLogoutCallback = useLogoutCallback;
function useLoginCallback() {
    const history = react_router_dom_1.useHistory();
    return () => {
        history.replace('/login');
    };
}
exports.useLoginCallback = useLoginCallback;
//# sourceMappingURL=AccountHooks.js.map