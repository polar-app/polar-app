"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorderLinearProgress = void 0;
const styles_1 = require("@material-ui/core/styles");
const LinearProgress_1 = __importDefault(require("@material-ui/core/LinearProgress"));
exports.BorderLinearProgress = styles_1.withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress_1.default);
//# sourceMappingURL=BorderLinearProgress.js.map