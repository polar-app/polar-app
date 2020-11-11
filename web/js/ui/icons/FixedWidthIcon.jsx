"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.FixedWidthIcon = void 0;
var React = require("react");
var FixedWidthIcon = /** @class */ (function (_super) {
    __extends(FixedWidthIcon, _super);
    function FixedWidthIcon(props, context) {
        return _super.call(this, props, context) || this;
    }
    FixedWidthIcon.prototype.render = function () {
        var style = __assign(__assign({}, this.props.style), { width: '20px', marginLeft: '0.3rem', marginRight: '0.3rem' });
        if (this.props.name) {
            return <i className={this.props.name} style={style}/>;
        }
        else {
            return <span style={style}/>;
        }
    };
    return FixedWidthIcon;
}(React.PureComponent));
exports.FixedWidthIcon = FixedWidthIcon;
