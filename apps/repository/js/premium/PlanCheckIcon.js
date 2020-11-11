"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanCheckIcon = void 0;
const react_1 = __importDefault(require("react"));
const MUIFontAwesome_1 = require("../../../../web/js/mui/MUIFontAwesome");
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    root: {
        color: theme.palette.primary.light
    },
}));
exports.PlanCheckIcon = react_1.default.memo(() => {
    const classes = useStyles();
    return (react_1.default.createElement(MUIFontAwesome_1.FACheckCircleIcon, { className: classes.root }));
});
//# sourceMappingURL=PlanCheckIcon.js.map