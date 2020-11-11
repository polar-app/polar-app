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
exports.ResponsiveImg = void 0;
var React = require("react");
var FastComponent_1 = require("../react/FastComponent");
/**
 * Shows a and image and re-sizes it to its parent properly.
 */
var ResponsiveImg = /** @class */ (function (_super) {
    __extends(ResponsiveImg, _super);
    function ResponsiveImg(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {};
        return _this;
    }
    ResponsiveImg.prototype.render = function () {
        var _a = this.props, img = _a.img, id = _a.id, color = _a.color;
        if (img) {
            var width = Math.floor(img.width);
            var height = Math.floor(img.height);
            return (
            // TODO: we need the ability to scroll to the most recent
            // annotation that is created but I need a functional way to do
            // this because how do I determine when it loses focus?
            <div className="area-highlight m-1" data-annotation-id={id} data-annotation-color={color} style={{
                display: 'block',
                textAlign: 'center',
                position: 'relative'
            }}>

                    <img style={{
                // core CSS properties for the image so that it
                // is responsive.
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                maxWidth: width,
                maxHeight: height,
                // border around the image
                boxSizing: 'content-box',
            }} draggable={false} className="" width={width} height={height} alt="screenshot" src={img.src}/>

                </div>);
        }
        else {
            return <div>{this.props.defaultText || 'No image'}</div>;
        }
    };
    return ResponsiveImg;
}(FastComponent_1.FastComponent));
exports.ResponsiveImg = ResponsiveImg;
