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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationTypeSelector = void 0;
const React = __importStar(require("react"));
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const Note_1 = __importDefault(require("@material-ui/icons/Note"));
const MUIMenu_1 = require("../../../../../../../web/js/mui/menu/MUIMenu");
const AnnotationTypeMenuItem_1 = require("./AnnotationTypeMenuItem");
class AnnotationTypeSelector extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const options = [
            {
                annotationType: AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT,
                label: 'text highlight'
            },
            {
                annotationType: AnnotationType_1.AnnotationType.AREA_HIGHLIGHT,
                label: 'area highlight'
            },
            {
                annotationType: AnnotationType_1.AnnotationType.COMMENT,
                label: 'comment'
            },
            {
                annotationType: AnnotationType_1.AnnotationType.FLASHCARD,
                label: 'flashcard'
            },
        ];
        return (React.createElement(MUIMenu_1.MUIMenu, { caret: true, button: {
                text: "Annotation Types",
                variant: 'outlined',
                icon: React.createElement(Note_1.default, null),
                size: 'small'
            } },
            React.createElement("div", null, options.map((current, idx) => {
                const selected = this.props.selected.includes(current.annotationType);
                const computeNewSelected = () => {
                    const newSelected = selected ?
                        this.props.selected.filter(item => item !== current.annotationType) :
                        [...this.props.selected, current.annotationType];
                    return newSelected;
                };
                const newSelected = computeNewSelected();
                const onClick = () => this.props.onSelected(newSelected);
                return React.createElement(AnnotationTypeMenuItem_1.AnnotationTypeMenuItem, { key: idx, selected: selected, onClick: onClick }, current.label);
            }))));
    }
}
exports.AnnotationTypeSelector = AnnotationTypeSelector;
//# sourceMappingURL=AnnotationTypeSelector.js.map