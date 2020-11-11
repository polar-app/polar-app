"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarSVGIcon = void 0;
var React = require("react");
var icon_svg_1 = require("polar-assets/src/assets/logo/icon.svg");
// TODO: if we embed how do we specify the width and height
exports.PolarSVGIcon = React.memo(function (props) { return (<img src={icon_svg_1.default} width={props.width} height={props.height} className={props.className} alt="Polar Logo"/>); });
