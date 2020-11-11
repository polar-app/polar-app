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
exports.ControlledAnnotationBars = void 0;
const ControlledAnnotationBar_1 = require("./ControlledAnnotationBar");
const React = __importStar(require("react"));
const ActiveSelections_1 = require("../popup/ActiveSelections");
const ReactDOM = __importStar(require("react-dom"));
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Points_1 = require("../../Points");
const Elements_1 = require("../../util/Elements");
const Preconditions_1 = require("polar-shared/src/Preconditions");
var ControlledAnnotationBars;
(function (ControlledAnnotationBars) {
    function create(controlledPopupProps, annotationBarCallbacks, opts) {
        registerEventListener(annotationBarCallbacks, opts);
    }
    ControlledAnnotationBars.create = create;
    function registerEventListener(annotationBarCallbacks, opts) {
        const handleTarget = (target) => {
            let annotationBar;
            ActiveSelections_1.ActiveSelections.addEventListener(activeSelectionEvent => {
                const computeAnnotationPageInfo = () => {
                    function getPageNumberForPageElement(pageElement) {
                        return parseInt(pageElement.getAttribute("data-page-number"), 10);
                    }
                    const computeForPDF = () => {
                        const pageElement = Elements_1.Elements.untilRoot(activeSelectionEvent.element, ".page");
                        if (!pageElement) {
                            return undefined;
                        }
                        const pageNum = getPageNumberForPageElement(pageElement);
                        return { popupContainer: pageElement, pageNum };
                    };
                    const computeForEPUB = () => {
                        const pageElement = window.parent.document.querySelector('.page');
                        const pageNum = getPageNumberForPageElement(pageElement);
                        return { popupContainer: target, pageNum };
                    };
                    switch (opts.fileType) {
                        case "pdf":
                            return computeForPDF();
                        case "epub":
                            return computeForEPUB();
                    }
                };
                const annotationPageInfo = computeAnnotationPageInfo();
                if (!annotationPageInfo) {
                    return;
                }
                switch (activeSelectionEvent.type) {
                    case 'created':
                        annotationBar = createAnnotationBar(annotationPageInfo.pageNum, annotationPageInfo.popupContainer, annotationBarCallbacks, activeSelectionEvent);
                        break;
                    case 'destroyed':
                        if (annotationBar) {
                            destroyAnnotationBar(annotationBar);
                        }
                        break;
                }
                if (activeSelectionEvent.type === 'destroyed') {
                    return;
                }
            }, target);
        };
        const targets = computeTargets(opts.fileType, opts.docViewerElementProvider);
        for (const target of targets) {
            handleTarget(target);
        }
    }
    function computeTargets(fileType, docViewerElementProvider) {
        const docViewerElement = docViewerElementProvider();
        function computeTargetsForPDF() {
            return Array.from(docViewerElement.querySelectorAll(".page"));
        }
        function computeTargetsForEPUB() {
            return Array.from(docViewerElement.querySelectorAll("iframe"))
                .map(iframe => iframe.contentDocument)
                .filter(contentDocument => Preconditions_1.isPresent(contentDocument))
                .map(contentDocument => contentDocument)
                .map(contentDocument => contentDocument.documentElement);
        }
        switch (fileType) {
            case "pdf":
                return computeTargetsForPDF();
            case "epub":
                return computeTargetsForEPUB();
        }
    }
    function destroyAnnotationBar(annotationBar) {
        if (annotationBar && annotationBar.parentElement) {
            annotationBar.parentElement.removeChild(annotationBar);
        }
    }
    function computePosition(pageElement, point, offset) {
        const origin = Optional_1.Optional.of(pageElement.getBoundingClientRect())
            .map(rect => {
            return { 'x': rect.left, 'y': rect.top };
        })
            .get();
        const relativePoint = Points_1.Points.relativeTo(origin, point);
        offset = offset || { x: 0, y: 0 };
        const left = relativePoint.x + offset.x;
        const top = relativePoint.y + offset.y;
        return {
            x: left,
            y: top
        };
    }
    function createAnnotationBar(pageNum, popupContainer, annotationBarCallbacks, activeSelectionEvent) {
        const point = {
            x: activeSelectionEvent.boundingClientRect.left + (activeSelectionEvent.boundingClientRect.width / 2),
            y: activeSelectionEvent.boundingClientRect.top
        };
        const offset = {
            x: -75,
            y: -50
        };
        const position = computePosition(popupContainer, point, offset);
        const annotationBar = document.createElement('div');
        annotationBar.setAttribute("class", 'polar-annotation-bar');
        annotationBar.addEventListener('mouseup', (event) => event.stopPropagation());
        annotationBar.addEventListener('mousedown', (event) => event.stopPropagation());
        const style = `position: absolute; top: ${position.y}px; left: ${position.x}px; z-index: 10000;`;
        annotationBar.setAttribute('style', style);
        popupContainer.insertBefore(annotationBar, popupContainer.firstChild);
        const onHighlightedCallback = (highlightCreatedEvent) => {
            annotationBarCallbacks.onHighlighted(highlightCreatedEvent);
            destroyAnnotationBar(annotationBar);
        };
        ReactDOM.render(React.createElement(ControlledAnnotationBar_1.ControlledAnnotationBar, { activeSelection: activeSelectionEvent, onHighlighted: onHighlightedCallback, type: 'range', pageNum: pageNum }), annotationBar);
        return annotationBar;
    }
})(ControlledAnnotationBars = exports.ControlledAnnotationBars || (exports.ControlledAnnotationBars = {}));
//# sourceMappingURL=ControlledAnnotationBars.js.map