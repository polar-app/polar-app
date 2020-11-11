"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGIcon = void 0;
var React = require("react");
/**
 * Wrapper to specify the size of an icon
 */
exports.SVGIcon = function (props) {
    return (<div style={{
        width: props.size + "px"
    }} className="ml-auto mr-auto">
            {props.children}
        </div>);
};
