"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIAsyncLoader = void 0;
const React = __importStar(require("react"));
const MUILoading_1 = require("./MUILoading");
const ReactLifecycleHooks_1 = require("../hooks/ReactLifecycleHooks");
exports.MUIAsyncLoader = function (props) {
    const data = ReactLifecycleHooks_1.useAsyncWithError({ promiseFn: props.provider, onReject: props.onReject });
    if (data) {
        return React.createElement(props.render, data);
    }
    return React.createElement(MUILoading_1.MUILoading, null);
};
//# sourceMappingURL=MUIAsyncLoader.js.map