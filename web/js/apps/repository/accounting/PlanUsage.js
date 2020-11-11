"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanUsage = void 0;
const react_1 = __importDefault(require("react"));
const Accounting_1 = require("./Accounting");
const Bytes_1 = require("polar-shared/src/util/Bytes");
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const BorderLinearProgress_1 = require("../../../mui/BorderLinearProgress");
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    labelBox: {
        display: 'flex',
        flexDirection: 'column'
    },
    labelValue: {
        fontSize: '2.5em',
        flexGrow: 1,
        textAlign: 'left'
    },
    labelValueDesc: {
        color: theme.palette.text.hint,
        textAlign: 'left'
    },
    labelLimit: {
        fontSize: '2.5em',
        color: theme.palette.text.hint,
        textAlign: 'right'
    },
    labelLimitDesc: {
        color: theme.palette.text.hint,
        textAlign: 'right'
    },
    progress: {
        marginTop: '2px',
        marginBottom: '2px',
        height: '0.7em',
    },
}));
const PlanUsageForStorage = () => {
    const classes = useStyles();
    const accountingUsage = Accounting_1.useAccountingUsage();
    const usageStr = Bytes_1.Bytes.format(accountingUsage.storage.value);
    const limitStr = Bytes_1.Bytes.format(accountingUsage.storage.limit);
    return (react_1.default.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
        react_1.default.createElement("div", { style: { display: 'flex' } },
            react_1.default.createElement("div", { className: classes.labelBox, style: { flexGrow: 1 } },
                react_1.default.createElement("div", { className: classes.labelValue }, usageStr),
                react_1.default.createElement("div", { className: classes.labelValueDesc }, "USED")),
            react_1.default.createElement("div", { className: classes.labelBox },
                react_1.default.createElement("div", { className: classes.labelLimit }, limitStr),
                react_1.default.createElement("div", { className: classes.labelLimitDesc }, "LIMIT"))),
        react_1.default.createElement(BorderLinearProgress_1.BorderLinearProgress, { className: classes.progress, color: "primary", variant: "determinate", value: accountingUsage.storage.usage || 0 })));
};
exports.PlanUsage = () => {
    return (react_1.default.createElement(PlanUsageForStorage, null));
};
//# sourceMappingURL=PlanUsage.js.map