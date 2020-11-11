"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogger = void 0;
const react_1 = __importDefault(require("react"));
const ConsoleLogger_1 = require("polar-shared/src/logger/ConsoleLogger");
const MUIDialogControllers_1 = require("./dialogs/MUIDialogControllers");
const Functions_1 = require("polar-shared/src/util/Functions");
const SentryBrowserLogger_1 = require("../logger/SentryBrowserLogger");
const MultiLogger_1 = require("../logger/MultiLogger");
function useLogger() {
    const dialogManager = MUIDialogControllers_1.useDialogManager();
    const sentryLogger = react_1.default.useMemo(() => new SentryBrowserLogger_1.SentryBrowserLogger(), []);
    return react_1.default.useMemo(() => {
        const muiLogger = new MUILogger(dialogManager);
        return new MultiLogger_1.MultiLogger(muiLogger, sentryLogger);
    }, [dialogManager, sentryLogger]);
}
exports.useLogger = useLogger;
class MUILogger extends ConsoleLogger_1.ConsoleLogger {
    constructor(dialogManager) {
        super();
        this.dialogManager = dialogManager;
        this.name = 'mui-logger';
    }
    error(msg, ...args) {
        super.error(msg, ...args);
        if (args.length > 0 && args[0] instanceof Error) {
            const createMessage = () => {
                const err = args[0];
                if (err.message && err.message !== '') {
                    return err.message;
                }
                else {
                    return undefined;
                }
            };
            const message = createMessage();
            this.createErrorDialog(message);
        }
        else {
            this.createErrorDialog(msg);
        }
    }
    createErrorDialog(msg) {
        const title = 'Internal Error';
        const subtitle = `An internal error has occurred: ` + (msg || 'No message given');
        this.dialogManager.confirm({
            type: 'error',
            title,
            subtitle,
            noCancel: true,
            onAccept: Functions_1.NULL_FUNCTION
        });
    }
}
//# sourceMappingURL=MUILogger.js.map