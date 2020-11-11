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
exports.TwoMigrationForAppRuntime = void 0;
const react_1 = __importDefault(require("react"));
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const TwoMigrationDialog_1 = require("./TwoMigrationDialog");
const MUILogger_1 = require("../../../../../web/js/mui/MUILogger");
exports.TwoMigrationForAppRuntime = react_1.default.memo((props) => {
    const [accepted, setAccepted] = react_1.default.useState(false);
    const log = MUILogger_1.useLogger();
    const handleClose = react_1.default.useCallback(() => {
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                yield props.onClose();
                setAccepted(true);
            });
        }
        doAsync()
            .catch(err => log.error(err));
    }, [log, props]);
    if (AppRuntime_1.AppRuntime.get() !== props.runtime) {
        return props.children;
    }
    if (accepted) {
        return props.children;
    }
    return (react_1.default.createElement(TwoMigrationDialog_1.TwoMigrationDialog, { onClose: handleClose }));
});
//# sourceMappingURL=TwoMigrationForAppRuntime.js.map