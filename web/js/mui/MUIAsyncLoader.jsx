"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIAsyncLoader = exports.Loading = void 0;
var react_1 = require("react");
var CircularProgress_1 = require("@material-ui/core/CircularProgress");
var ReviewerScreen_1 = require("../../../apps/repository/js/reviewer/ReviewerScreen");
exports.Loading = function () { return (<div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    overflow: 'hidden'
}}>

        <CircularProgress_1.default style={{
    margin: 'auto',
    width: '75px',
    height: '75px',
}}/>

    </div>); };
exports.MUIAsyncLoader = function (props) {
    var data = ReviewerScreen_1.useAsyncWithError({ promiseFn: props.provider, onReject: props.onReject });
    if (data) {
        return react_1.default.createElement(props.render, data);
    }
    return <exports.Loading />;
};
