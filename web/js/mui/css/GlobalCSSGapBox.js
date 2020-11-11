"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalCssGapBox = void 0;
const withStyles_1 = __importDefault(require("@material-ui/core/styles/withStyles"));
const GlobalCssGapBoxStyles = withStyles_1.default({
    '@global': {
        ".gap-box > *": {
            marginLeft: '5px'
        },
        ".gap-box > *:first-child": {
            marginLeft: 0
        }
    },
});
exports.GlobalCssGapBox = GlobalCssGapBoxStyles(() => null);
//# sourceMappingURL=GlobalCSSGapBox.js.map