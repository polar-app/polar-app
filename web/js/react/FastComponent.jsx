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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastComponent = void 0;
var React = require("react");
var react_fast_compare_1 = require("react-fast-compare");
/**
 * Like PureComponent but does a deep comparison.
 */
var FastComponent = /** @class */ (function (_super) {
    __extends(FastComponent, _super);
    function FastComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FastComponent.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
        if (!react_fast_compare_1.default(this.props, nextProps)) {
            return true;
        }
        // if (! deepEqual(this.state, nextState)) {
        //     return true;
        // }
        return false;
    };
    return FastComponent;
}(React.Component));
exports.FastComponent = FastComponent;
