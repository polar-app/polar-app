"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingFAQ = void 0;
const react_1 = __importDefault(require("react"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const useStyles = makeStyles_1.default({
    root: {
        fontSize: '1.4em',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
});
exports.PricingFAQ = react_1.default.memo(() => {
    const classes = useStyles();
    return (react_1.default.createElement("div", { className: classes.root },
        react_1.default.createElement("h2", { style: { textAlign: 'center' } }, "Frequently Asked Questions"),
        react_1.default.createElement("h3", null, "How is my data stored?  Is it safe?"),
        react_1.default.createElement("p", null,
            "All data (your documents, notes, annotations, etc) is stored in our cloud infrastructure and ",
            react_1.default.createElement("b", null, "fully-encrypted"),
            " in transit and stored encrypted on our servers."),
        react_1.default.createElement("h3", null, "How are you handling premium users from Polar 1.0?"),
        react_1.default.createElement("p", null,
            "With Polar 2.0 we changed pricing to provide more data storage and all 1.0 users have been migrated to larger plans with no pricing increase.  We're also increasing storage for 1.0 users on the",
            react_1.default.createElement("i", null, "free"),
            " tier from 350MB to 2GB (vs the standard 1GB for new users on the free tier)."),
        react_1.default.createElement("h3", null, "Do you have enterprise pricing?"),
        react_1.default.createElement("p", null, "Yes.  Please reach out pricing for universities, corporations, etc.")));
});
//# sourceMappingURL=PricingFAQ.js.map