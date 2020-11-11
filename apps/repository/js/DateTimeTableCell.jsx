"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeTableCell = void 0;
var React = require("react");
var Preconditions_1 = require("polar-shared/src/Preconditions");
var react_moment_1 = require("react-moment");
exports.DateTimeTableCell = React.memo(function (props) {
    if (Preconditions_1.isPresent(props.datetime)) {
        return (<react_moment_1.default withTitle={true} className={props.className || ''} style={__assign({ whiteSpace: 'nowrap', userSelect: "none" }, props.style)} titleFormat="D MMM YYYY hh:MM A" 
        // filter={(value) => value.replace(/^an? /g, '1 ')}
        fromNow ago>
                {props.datetime}
            </react_moment_1.default>);
    }
    else {
        return null;
    }
});
