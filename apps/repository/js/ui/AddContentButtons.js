"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddContentButtons = void 0;
const react_1 = __importDefault(require("react"));
const AccountUpgrader_1 = require("../../../../web/js/ui/account_upgrade/AccountUpgrader");
const MUIDialogControllers_1 = require("../../../../web/js/mui/dialogs/MUIDialogControllers");
const Functions_1 = require("polar-shared/src/util/Functions");
var AddContentButtons;
(function (AddContentButtons) {
    function useAccountVerifiedAction() {
        const accountUpgrade = AccountUpgrader_1.useAccountUpgrader();
        const dialogs = MUIDialogControllers_1.useDialogManager();
        return react_1.default.useCallback((delegate) => {
            if (accountUpgrade === null || accountUpgrade === void 0 ? void 0 : accountUpgrade.required) {
                dialogs.confirm({
                    title: 'Account upgrade required',
                    subtitle: `You've reach the limits of your plan and need to upgrade to ${accountUpgrade.toPlan.level}`,
                    onAccept: Functions_1.NULL_FUNCTION
                });
            }
            else {
                delegate();
            }
        }, [accountUpgrade, dialogs]);
    }
    AddContentButtons.useAccountVerifiedAction = useAccountVerifiedAction;
})(AddContentButtons = exports.AddContentButtons || (exports.AddContentButtons = {}));
//# sourceMappingURL=AddContentButtons.js.map