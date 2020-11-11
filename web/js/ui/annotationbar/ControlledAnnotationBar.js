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
exports.ControlledAnnotationBar = void 0;
const React = __importStar(require("react"));
const AnnotationHighlightButton_1 = require("./AnnotationHighlightButton");
exports.ControlledAnnotationBar = (props) => {
    function dispatchOnHighlighted(highlightColor) {
        const highlightCreatedEvent = {
            activeSelection: props.activeSelection,
            highlightColor,
            pageNum: props.pageNum,
            annotationDescriptor: props.annotationDescriptor
        };
        props.onHighlighted(highlightCreatedEvent);
    }
    return (React.createElement("div", null,
        React.createElement("div", { className: "polar-ui", style: {
                backgroundColor: '#333333',
                fontSize: '14px',
                padding: '0',
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '5px',
                paddingBottom: '5px',
                borderRadius: '3px',
                boxShadow: '0 0 5px #000'
            } },
            React.createElement(AnnotationHighlightButton_1.AnnotationHighlightButton, { dispatchColor: 'yellow', styleColor: 'rgba(255,255,0)', onHighlightedColor: color => dispatchOnHighlighted(color) }),
            React.createElement(AnnotationHighlightButton_1.AnnotationHighlightButton, { dispatchColor: 'red', styleColor: 'rgba(255,0,0)', onHighlightedColor: color => dispatchOnHighlighted(color) }),
            React.createElement(AnnotationHighlightButton_1.AnnotationHighlightButton, { dispatchColor: 'green', styleColor: 'rgba(0,255,0)', onHighlightedColor: color => dispatchOnHighlighted(color) }),
            React.createElement(AnnotationHighlightButton_1.AnnotationHighlightButton, { dispatchColor: '#9900EF', styleColor: '#9900EF', onHighlightedColor: color => dispatchOnHighlighted(color) }),
            React.createElement(AnnotationHighlightButton_1.AnnotationHighlightButton, { dispatchColor: '#FF6900', styleColor: '#FF6900', onHighlightedColor: color => dispatchOnHighlighted(color) }))));
};
//# sourceMappingURL=ControlledAnnotationBar.js.map