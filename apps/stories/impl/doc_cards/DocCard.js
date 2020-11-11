"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocCard = void 0;
const react_1 = __importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const Card_1 = __importDefault(require("@material-ui/core/Card"));
const CardActionArea_1 = __importDefault(require("@material-ui/core/CardActionArea"));
const CardActions_1 = __importDefault(require("@material-ui/core/CardActions"));
const CardContent_1 = __importDefault(require("@material-ui/core/CardContent"));
const CardMedia_1 = __importDefault(require("@material-ui/core/CardMedia"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const useStyles = styles_1.makeStyles({
    root: {
        maxWidth: 300,
        maxHeight: 350,
    },
});
exports.DocCard = react_1.default.memo((props) => {
    const classes = useStyles();
    return (react_1.default.createElement(Card_1.default, { className: classes.root },
        react_1.default.createElement(CardActionArea_1.default, null,
            react_1.default.createElement(CardMedia_1.default, { component: "img", alt: props.title, height: "150", style: {
                    objectPosition: '50% top'
                }, image: props.imgURL, title: props.title }),
            react_1.default.createElement(CardContent_1.default, null,
                react_1.default.createElement(Typography_1.default, { gutterBottom: true, variant: "h6", component: "h6", style: {
                        lineHeight: '1.2em'
                    } }, props.title),
                react_1.default.createElement(Typography_1.default, { variant: "body2", color: "textSecondary", component: "p", style: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    } }, props.description))),
        react_1.default.createElement(CardActions_1.default, null,
            react_1.default.createElement(Button_1.default, { size: "small", color: "primary" }, "Share"),
            react_1.default.createElement(Button_1.default, { size: "small", color: "primary" }, "Open"))));
});
//# sourceMappingURL=DocCard.js.map