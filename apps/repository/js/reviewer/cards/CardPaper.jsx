"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardPaper = void 0;
var FadeIn_1 = require("../../../../../web/js/ui/motion/FadeIn");
var Paper_1 = require("@material-ui/core/Paper");
var React = require("react");
var makeStyles_1 = require("@material-ui/core/styles/makeStyles");
var createStyles_1 = require("@material-ui/core/styles/createStyles");
var useStyles = makeStyles_1.default(function () {
    return createStyles_1.default({
        card: {
            fontSize: '2.0rem',
        },
    });
});
exports.CardPaper = function (props) {
    var classes = useStyles();
    return (<FadeIn_1.FadeIn style={{
        display: 'flex',
        flexGrow: 1
    }}>
            <Paper_1.default variant="outlined" className={"mb-auto ml-auto mr-auto shadow-narrow p-3 " + classes.card} style={{
        minWidth: '300px',
        maxWidth: '700px',
        width: '85%'
    }}>
                {props.children}
            </Paper_1.default>
        </FadeIn_1.FadeIn>);
};
