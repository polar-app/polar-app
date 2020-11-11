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
exports.ViewerTour = exports.Styles = void 0;
const react_joyride_1 = __importStar(require("react-joyride"));
const React = __importStar(require("react"));
const LifecycleToggle_1 = require("../../ui/util/LifecycleToggle");
const LifecycleEvents_1 = require("../../ui/util/LifecycleEvents");
const JoyrideTours_1 = require("../../ui/tours/JoyrideTours");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
class Styles {
}
exports.Styles = Styles;
Styles.IMG = {
    maxWidth: '450px',
    maxHeight: '325px',
    marginBottom: '10px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
};
class ViewerTour extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onCallback = this.onCallback.bind(this);
        const run = !LifecycleToggle_1.LifecycleToggle.isMarked(LifecycleEvents_1.LifecycleEvents.VIEWER_TOUR_TERMINATED) &&
            AppRuntime_1.AppRuntime.isElectron();
        this.state = {
            run
        };
    }
    render() {
        const Term = (props) => {
            return React.createElement("b", null,
                React.createElement("i", null, props.children));
        };
        const Title = (props) => {
            return React.createElement("div", { style: { fontSize: '22px' } }, props.children);
        };
        const steps = [
            JoyrideTours_1.JoyrideTours.createImageStep({
                target: '.polar-sidebar',
                title: React.createElement(Title, null, "Document Viewer"),
                content: React.createElement("div", null,
                    React.createElement("p", null,
                        "This is the main document viewer and allows you to both view and ",
                        React.createElement(Term, null, "annotate"),
                        " documents."),
                    React.createElement("p", null, "It supports the following features: "),
                    React.createElement("ul", { style: { marginLeft: '20px' } },
                        React.createElement("li", null, "Keeping track of your reading with pagemarks."),
                        React.createElement("li", null, "Highlighting text within the document"),
                        React.createElement("li", null, "Creating comments and flashcards attached to these highlights."))),
                image: "/web/assets/images/doc.svg",
                placement: 'center'
            }),
            {
                target: '.polar-sidebar',
                title: React.createElement(Title, null, "Annotation Sidebar"),
                disableBeacon: true,
                placement: 'left-start',
                spotlightPadding: 0,
                content: React.createElement("div", null,
                    React.createElement("p", null,
                        "The ",
                        React.createElement(Term, null, "annotation sidebar"),
                        " lists all annotations on the current document including highlights , comments, and flashcards."))
            },
            {
                target: '#polar-progress',
                title: React.createElement(Title, null, "Progress Bar"),
                disableBeacon: true,
                spotlightPadding: 0,
                content: React.createElement("div", null,
                    React.createElement("p", null,
                        "The ",
                        React.createElement(Term, null, "progress bar"),
                        " keeps track of how much of the document you've read by using ",
                        React.createElement(Term, null, "pagemarks"),
                        "."),
                    React.createElement("p", null, "Pagemarks are manually created by the user while reading documents."),
                    React.createElement("p", null,
                        "To create a pagemark just ",
                        React.createElement(Term, null, "right click"),
                        " and select ",
                        React.createElement(Term, null, "Create Pagemark to Point"),
                        "."),
                    React.createElement("p", null, "Also, when using pagemarks we will automatically resume your reading by jumping to the point where you last left off."))
            },
            {
                target: '.annotation-sidebar .text-highlight',
                title: React.createElement(Title, null, "Text Highlights"),
                disableBeacon: true,
                spotlightPadding: 5,
                content: React.createElement("div", null,
                    React.createElement("p", null,
                        React.createElement(Term, null, "Text highlights"),
                        " are stored for easy reference on the annotation sidebar."),
                    React.createElement("p", null,
                        "This includes both associated ",
                        React.createElement(Term, null, "comments"),
                        " and ",
                        React.createElement(Term, null, "flashcards"),
                        ".")),
                placement: 'left'
            },
        ];
        return (React.createElement(react_joyride_1.default, { steps: steps, continuous: true, callback: data => this.onCallback(data), run: this.state.run, showProgress: true, showSkipButton: true, styles: {
                options: {
                    primaryColor: '#007bff',
                    zIndex: 999999999,
                },
                tooltipContainer: {
                    textAlign: 'left',
                }
            } }));
    }
    onCallback(callbackProps) {
        if (callbackProps.status === react_joyride_1.STATUS.SKIPPED || callbackProps.status === react_joyride_1.STATUS.FINISHED) {
            try {
                switch (callbackProps.status) {
                    case react_joyride_1.STATUS.SKIPPED:
                        LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.VIEWER_TOUR_SKIPPED);
                        break;
                    case react_joyride_1.STATUS.FINISHED:
                        LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.VIEWER_TOUR_FINISHED);
                        break;
                }
            }
            finally {
                LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.VIEWER_TOUR_TERMINATED);
            }
        }
    }
}
exports.ViewerTour = ViewerTour;
//# sourceMappingURL=ViewerTour.js.map