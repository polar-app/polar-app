"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularProgressWithLabel = void 0;
var react_1 = require("react");
var CircularProgress_1 = require("@material-ui/core/CircularProgress");
var Typography_1 = require("@material-ui/core/Typography");
var Box_1 = require("@material-ui/core/Box");
var ReactUtils_1 = require("../react/ReactUtils");
exports.CircularProgressWithLabel = ReactUtils_1.deepMemo(function (props) {
    return (<Box_1.default position="relative" display="inline-flex">
            <CircularProgress_1.default variant="static" {...props}/>
            <Box_1.default top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
                <Typography_1.default variant="caption" component="div" color="textSecondary">{Math.round(props.value) + "%"}</Typography_1.default>
            </Box_1.default>
        </Box_1.default>);
});
