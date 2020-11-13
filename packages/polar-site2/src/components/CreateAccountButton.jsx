"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountButton = void 0;
var gatsby_material_ui_components_1 = require("gatsby-material-ui-components");
var React = require("react");
var core_1 = require("@material-ui/core");
var useStyles = core_1.makeStyles({
    buttonAccount: {
        textTransform: "none",
        marginTop: "10px",
        marginBottom: "10px",
        width: "183px",
        backgroundColor: "#6754D6",
    },
});
exports.CreateAccountButton = function (props) {
    var classes = useStyles();
    var size = props.size || 'large';
    var fontSize = size === 'large' ? '18px' : '15px';
    return (<gatsby_material_ui_components_1.Button className={classes.buttonAccount} variant="contained" size={size} color="primary" style={{ fontSize: fontSize }} href="https://app.getpolarized.io">
            Create Account
        </gatsby_material_ui_components_1.Button>);
};
