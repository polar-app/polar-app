"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FadeIn = void 0;
var framer_motion_1 = require("framer-motion");
var React = require("react");
exports.FadeIn = function (props) {
    return (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={props.style} exit={{ opacity: 0 }}>

            {props.children}
        </framer_motion_1.motion.div>);
};
