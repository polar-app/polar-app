"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogger = void 0;
var react_1 = require("react");
var ConsoleLogger_1 = require("polar-shared/src/logger/ConsoleLogger");
var MUIDialogControllers_1 = require("./dialogs/MUIDialogControllers");
var Functions_1 = require("polar-shared/src/util/Functions");
var SentryBrowserLogger_1 = require("../logger/SentryBrowserLogger");
var MultiLogger_1 = require("../logger/MultiLogger");
/**
 * Used so that we can use our MUI error dialog if an error was raised.
 */
function useLogger() {
    var dialogManager = MUIDialogControllers_1.useDialogManager();
    var sentryLogger = react_1.default.useMemo(function () { return new SentryBrowserLogger_1.SentryBrowserLogger(); }, []);
    // it's important to useMemo here or the value will change and can trigger
    // too many renders of root components and nuke performance.
    return react_1.default.useMemo(function () {
        var muiLogger = new MUILogger(dialogManager);
        return new MultiLogger_1.MultiLogger(muiLogger, sentryLogger);
    }, [dialogManager, sentryLogger]);
}
exports.useLogger = useLogger;
/**
 * Logger that just uses the DialogManager to display errors in a snackbar.
 */
var MUILogger = /** @class */ (function (_super) {
    __extends(MUILogger, _super);
    function MUILogger(dialogManager) {
        var _this = _super.call(this) || this;
        _this.dialogManager = dialogManager;
        _this.name = 'mui-logger';
        return _this;
    }
    MUILogger.prototype.error = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        _super.prototype.error.apply(this, __spreadArrays([msg], args));
        if (args.length > 0 && args[0] instanceof Error) {
            var createMessage = function () {
                var err = args[0];
                if (err.message && err.message !== '') {
                    return err.message;
                }
                else {
                    return undefined;
                }
            };
            var message = createMessage();
            this.createErrorDialog(message);
        }
        else {
            this.createErrorDialog(msg);
        }
    };
    MUILogger.prototype.createErrorDialog = function (msg) {
        var title = 'Internal Error';
        var subtitle = "An internal error has occurred: " + (msg || 'No message given');
        this.dialogManager.confirm({
            type: 'error',
            title: title,
            subtitle: subtitle,
            noCancel: true,
            onAccept: Functions_1.NULL_FUNCTION
        });
    };
    return MUILogger;
}(ConsoleLogger_1.ConsoleLogger));
