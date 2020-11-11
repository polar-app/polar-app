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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeleteConfirmation = exports.useAsyncActionTaskbar = exports.useDialogManager = void 0;
const react_1 = __importDefault(require("react"));
const MUIDialogController_1 = require("./MUIDialogController");
const Functions_1 = require("polar-shared/src/util/Functions");
const MUILogger_1 = require("../MUILogger");
function useDialogManager() {
    return react_1.default.useContext(MUIDialogController_1.MUIDialogControllerContext);
}
exports.useDialogManager = useDialogManager;
function useAsyncActionTaskbar() {
    const dialogs = useDialogManager();
    const logger = MUILogger_1.useLogger();
    return react_1.default.useCallback((opts) => {
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const updateProgress = yield dialogs.taskbar({
                    message: opts.message
                });
                updateProgress({ value: 'indeterminate' });
                try {
                    yield opts.action();
                }
                finally {
                    updateProgress({ value: 100 });
                }
            });
        }
        doAsync().catch(err => logger.error(err));
    }, [dialogs, logger]);
}
exports.useAsyncActionTaskbar = useAsyncActionTaskbar;
function useDeleteConfirmation(onAccept, onCancel = Functions_1.NULL_FUNCTION) {
    const dialogs = useDialogManager();
    return (values) => {
        dialogs.confirm({
            title: "Are you sure you want to delete these item(s)?",
            subtitle: "This is a permanent operation and can't be undone.  ",
            type: 'danger',
            onCancel,
            onAccept: () => onAccept(values),
        });
    };
}
exports.useDeleteConfirmation = useDeleteConfirmation;
//# sourceMappingURL=MUIDialogControllers.js.map