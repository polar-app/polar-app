"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAvatar = void 0;
const Avatar_1 = __importDefault(require("@material-ui/core/Avatar"));
const react_1 = __importDefault(require("react"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const AccountCircle_1 = __importDefault(require("@material-ui/icons/AccountCircle"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    medium: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    xlarge: {
        width: theme.spacing(9),
        height: theme.spacing(9),
    },
}));
exports.UserAvatar = react_1.default.memo((props) => {
    const classes = useStyles();
    const size = props.size || 'small';
    const displayName = props.displayName ? props.displayName.trim() : "";
    const classNameMap = {
        small: classes.small,
        medium: undefined,
        large: classes.large,
        xlarge: classes.xlarge,
    };
    const className = classNameMap[size];
    if (props.photoURL) {
        return (react_1.default.createElement(Avatar_1.default, { src: props.photoURL, className: className, style: props.style }));
    }
    else if (displayName !== '') {
        const letter = displayName[0].toUpperCase();
        return (react_1.default.createElement(Avatar_1.default, { className: className, style: props.style }, letter));
    }
    else {
        return (react_1.default.createElement(Avatar_1.default, { className: className, style: props.style },
            react_1.default.createElement(AccountCircle_1.default, null)));
    }
}, react_fast_compare_1.default);
//# sourceMappingURL=UserAvatar.js.map