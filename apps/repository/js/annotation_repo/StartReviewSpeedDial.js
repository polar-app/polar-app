"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartReviewSpeedDial = void 0;
const react_router_dom_1 = require("react-router-dom");
const react_1 = __importDefault(require("react"));
const SpeedDial_1 = __importDefault(require("@material-ui/lab/SpeedDial"));
const RateReview_1 = __importDefault(require("@material-ui/icons/RateReview"));
const SpeedDialAction_1 = __importDefault(require("@material-ui/lab/SpeedDialAction"));
const LocalLibrary_1 = __importDefault(require("@material-ui/icons/LocalLibrary"));
const FlashOn_1 = __importDefault(require("@material-ui/icons/FlashOn"));
const styles_1 = require("@material-ui/core/styles");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    root: {
        height: 380,
        transform: 'translateZ(0px)',
        flexGrow: 1,
    },
    speedDial: {
        position: 'absolute',
        bottom: theme.spacing(8),
        right: theme.spacing(2),
    },
}));
function StartReviewSpeedDial() {
    const history = react_router_dom_1.useHistory();
    const classes = useStyles();
    const [open, setOpen] = react_1.default.useState(false);
    const [hidden, setHidden] = react_1.default.useState(false);
    function handleReading() {
        handleClose();
        history.push({ pathname: '/annotations', hash: '#review-reading' });
    }
    function handleFlashcards() {
        handleClose();
        history.push({ pathname: '/annotations', hash: '#review-flashcards' });
    }
    const handleVisibility = () => {
        setHidden((prevHidden) => !prevHidden);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (react_1.default.createElement(SpeedDial_1.default, { ariaLabel: "Start Review", className: classes.speedDial, hidden: hidden, icon: react_1.default.createElement(RateReview_1.default, null), onClose: handleClose, onOpen: handleOpen, open: open },
        react_1.default.createElement(SpeedDialAction_1.default, { icon: react_1.default.createElement(LocalLibrary_1.default, null), title: "Reading", tooltipTitle: "Reading", tooltipOpen: true, color: "secondary", onClick: handleReading }),
        react_1.default.createElement(SpeedDialAction_1.default, { icon: react_1.default.createElement(FlashOn_1.default, null), title: "Flashcards", tooltipTitle: "Flashcards", tooltipOpen: true, color: "secondary", onClick: handleFlashcards })));
}
exports.StartReviewSpeedDial = StartReviewSpeedDial;
//# sourceMappingURL=StartReviewSpeedDial.js.map