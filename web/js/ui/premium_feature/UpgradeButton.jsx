"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeButton = void 0;
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
var Button_1 = require("@material-ui/core/Button");
var LockOpen_1 = require("@material-ui/icons/LockOpen");
var ReactUtils_1 = require("../../react/ReactUtils");
exports.UpgradeButton = ReactUtils_1.deepMemo(function (props) {
    var history = react_router_dom_1.useHistory();
    var required = props.required, feature = props.feature;
    return (<Button_1.default variant="contained" size="small" className="border" startIcon={<LockOpen_1.default />} onClick={function () { return history.push("/plans"); }}>

            Upgrade to {required} to unlock {feature}

        </Button_1.default>);
});
