"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDialog = void 0;
var ReactUtils_1 = require("../../react/ReactUtils");
var Dialog_1 = require("@material-ui/core/Dialog");
var react_1 = require("react");
/**
 * Dialog that prevents events from being handled up the tree.
 */
exports.MUIDialog = ReactUtils_1.deepMemo(function (props) {
    return (<Dialog_1.default {...props} transitionDuration={50}>

            {props.children}

        </Dialog_1.default>);
});
