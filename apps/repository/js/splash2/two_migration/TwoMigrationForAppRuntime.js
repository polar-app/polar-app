"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoMigrationForAppRuntime = void 0;
const react_1 = __importDefault(require("react"));
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const TwoMigrationDialog_1 = require("./TwoMigrationDialog");
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const TwoMigration_1 = require("./TwoMigration");
exports.TwoMigrationForAppRuntime = ReactUtils_1.deepMemo((props) => {
    const [accepted, setAccepted] = react_1.default.useState(false);
    function handleClose() {
        setAccepted(true);
        TwoMigration_1.TwoMigration.markShown();
    }
    if (AppRuntime_1.AppRuntime.get() !== props.runtime) {
        return props.children;
    }
    if (!TwoMigration_1.TwoMigration.shouldShow()) {
        return props.children;
    }
    if (accepted) {
        return props.children;
    }
    return (react_1.default.createElement(TwoMigrationDialog_1.TwoMigrationDialog, { onClose: handleClose }));
});
//# sourceMappingURL=TwoMigrationForAppRuntime.js.map