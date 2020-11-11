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
exports.PreviewTour = exports.Styles = void 0;
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
class PreviewTour extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onCallback = this.onCallback.bind(this);
        const run = !LifecycleToggle_1.LifecycleToggle.isMarked(LifecycleEvents_1.LifecycleEvents.PREVIEW_TOUR_TERMINATED) &&
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
                target: 'header',
                content: React.createElement("div", null,
                    React.createElement("h2", { className: "text-center" }, "Welcome to Polar!"),
                    React.createElement("p", null, "This is the document preview window in Polar."),
                    React.createElement("p", null, "Polar allows you to:"),
                    React.createElement("ul", null,
                        React.createElement("li", null, "Keep all your documents in one place."),
                        React.createElement("li", null,
                            "Easily keep track of your reading with ",
                            React.createElement("b", null, "pagemarks"),
                            " and ",
                            React.createElement("b", null, "stats tracking"),
                            "."),
                        React.createElement("li", null,
                            React.createElement("b", null, "Annotate"),
                            ", ",
                            React.createElement("b", null, "tag"),
                            ", and ",
                            React.createElement("span", { className: "text-dark", style: { backgroundColor: 'yellow' } },
                                React.createElement("b", null, "highlight")),
                            " all your documents and build a personal knowledge repository.")),
                    React.createElement("p", null,
                        "Additionally, Polar supports ",
                        React.createElement("b", null, "not just PDF"),
                        " documents but capturing ",
                        React.createElement("b", null, "web content"),
                        " and storing it offline in your archive in perpetuity."),
                    React.createElement("p", null, "The tour should take about 60 seconds.")),
                image: "/icon.png",
                placement: 'center'
            }),
            JoyrideTours_1.JoyrideTours.createImageStep({
                target: '.polar-sidebar',
                title: React.createElement(Title, null, "Document Viewer"),
                content: React.createElement("div", null,
                    React.createElement("p", null,
                        "This is the main document viewer and allows you to both view and ",
                        React.createElement(Term, null, "annotate"),
                        " documents.")),
                image: "/web/assets/images/doc.svg",
                placement: 'center'
            }),
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
                        LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.PREVIEW_TOUR_SKIPPED);
                        break;
                    case react_joyride_1.STATUS.FINISHED:
                        LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.PREVIEW_TOUR_FINISHED);
                        break;
                }
            }
            finally {
                LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.PREVIEW_TOUR_TERMINATED);
            }
        }
    }
}
exports.PreviewTour = PreviewTour;
//# sourceMappingURL=PreviewTour.js.map