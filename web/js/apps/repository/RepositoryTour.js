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
exports.RepositoryTour = exports.Styles = void 0;
const react_joyride_1 = __importStar(require("react-joyride"));
const React = __importStar(require("react"));
const LifecycleToggle_1 = require("../../ui/util/LifecycleToggle");
const LifecycleEvents_1 = require("../../ui/util/LifecycleEvents");
const Logger_1 = require("polar-shared/src/logger/Logger");
const JoyrideTours_1 = require("../../ui/tours/JoyrideTours");
const Devices_1 = require("polar-shared/src/util/Devices");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const log = Logger_1.Logger.create();
const Z_INDEX = 100000;
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
Styles.SPLIT_BAR_IMG = {
    maxWidth: '225px',
    maxHeight: '225px',
    marginBottom: '10px',
    display: 'block',
    marginLeft: '5px',
    marginRight: '5px',
};
class RepositoryTour extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onCallback = this.onCallback.bind(this);
        this.createSteps = this.createSteps.bind(this);
        this.steps = this.createSteps();
        const run = !LifecycleToggle_1.LifecycleToggle.isMarked(LifecycleEvents_1.LifecycleEvents.TOUR_TERMINATED);
        this.state = {
            run,
            stepIndex: 0
        };
    }
    render() {
        if (!Devices_1.Devices.isDesktop()) {
            return null;
        }
        return (React.createElement(react_joyride_1.default, { steps: this.steps, continuous: true, callback: data => this.onCallback(data), run: this.state.run, showProgress: true, showSkipButton: true, stepIndex: this.state.stepIndex, styles: {
                options: {
                    primaryColor: '#007bff',
                    zIndex: Z_INDEX,
                },
                tooltipContainer: {
                    textAlign: 'left',
                }
            } }));
    }
    createSteps() {
        const Term = (props) => {
            return React.createElement("b", null,
                React.createElement("i", null, props.children));
        };
        const Title = (props) => {
            return React.createElement("div", { style: {
                    fontSize: '22px',
                    marginLeft: '10px'
                } }, props.children);
        };
        const Icon = (props) => {
            return React.createElement("div", { className: "text-primary" },
                React.createElement("i", { className: props.className, style: {
                        fontSize: '175px',
                        marginLeft: '5px',
                    } }));
        };
        const steps = [
            JoyrideTours_1.JoyrideTours.createImageStep({
                target: 'header',
                content: React.createElement("div", null,
                    React.createElement("h2", { className: "text-center" }, "Welcome to Polar!"),
                    React.createElement("p", null, "Polar allows you to:"),
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            React.createElement("b", null, "Keep all your reading"),
                            " in one place."),
                        React.createElement("li", null,
                            React.createElement("b", null, "Track all your reading"),
                            " statistics."),
                        React.createElement("li", null,
                            React.createElement("b", null, "Build a personal knowledge repository"),
                            " with ",
                            React.createElement("span", { className: "text-dark", style: { backgroundColor: 'rgba(255,255,0.3)' } },
                                React.createElement("b", null, "highlights")),
                            ", tags, and annotations."),
                        React.createElement("li", null,
                            React.createElement("b", null, "Permanently remember"),
                            " facts using spaced repetition and incremental reading")),
                    React.createElement("p", null,
                        "Additionally, Polar supports ",
                        React.createElement("b", null, "not just PDF"),
                        " documents but capturing ",
                        React.createElement("b", null, "web content"),
                        " and storing it offline in your archive - forever!")),
                image: "/icon.png",
                placement: 'center'
            }),
            JoyrideTours_1.JoyrideTours.createImageStep({
                target: 'header',
                title: React.createElement(Title, null, "Web, Desktop and Cloud."),
                content: React.createElement("div", null,
                    React.createElement("p", null,
                        "You're using the ",
                        React.createElement("b", null, "web"),
                        " version of Polar."),
                    React.createElement("p", null,
                        "Polar works on both the desktop (MacOS, Windows, and Linux) as well as the web (Chrome, Firefox, and major browsers) and is ",
                        React.createElement("b", null, "fully cloud aware"),
                        ".")),
                image: "/web/assets/images/web.svg",
                placement: 'center',
                disabled: AppRuntime_1.AppRuntime.isElectron()
            }),
            {
                target: '#add-tags-dropdown',
                title: React.createElement(Title, null, "Create Folders and Tags"),
                disableBeacon: true,
                content: React.createElement("div", null,
                    React.createElement("p", null, "You can create folders or tags by selecting this button or right clicking on the sidebar.")),
            },
            JoyrideTours_1.JoyrideTours.createImageStep({
                target: '#enable-cloud-sync, #cloud-sync-dropdown',
                title: React.createElement(Title, null, "Cloud Sync"),
                content: React.createElement("div", null,
                    React.createElement("p", null,
                        "Polar supports ",
                        React.createElement(Term, null, "cloud sync"),
                        " which keeps all your documents securely backed up in the cloud. Enabling ",
                        React.createElement(Term, null, "cloud sync"),
                        " also allow you to keep all your computers that run Polar fully synchronized."),
                    React.createElement("p", null, "This works transparently and realtime across MacOS, Windows, and Linux.")),
                image: React.createElement(Icon, { className: "fas fa-cloud-upload-alt" }),
                disabled: !AppRuntime_1.AppRuntime.isElectron()
            }),
            {
                target: '.doc-table-col-progress',
                title: React.createElement(Title, null, "Reading Progress"),
                disableBeacon: true,
                content: React.createElement("div", null,
                    React.createElement("b", null, "Track your reading progress"),
                    " in each document with pagemarks (manually now, soon to be automatic)."),
            },
            {
                target: '.doc-dropdown',
                disableBeacon: true,
                content: React.createElement("div", null,
                    "Documents can be ",
                    React.createElement("b", null, "tagged, flagged, archived or deleted"),
                    "."),
                styles: {
                    tooltip: {
                        width: '650px'
                    }
                },
            },
            {
                target: '#add-content-dropdown',
                title: React.createElement(Title, null, "Add Documents"),
                content: React.createElement("div", null,
                    React.createElement("p", null,
                        "Get started now by ",
                        React.createElement("b", null, "clicking here to upload your first document"),
                        ".")),
            },
        ];
        return steps.filter(current => !current.disabled);
    }
    onCallback(callbackProps) {
        this.callback = callbackProps;
        const step = callbackProps.step;
        if (callbackProps.action === 'update' && step.autoNext) {
            const nextStep = this.steps[callbackProps.index + 1];
            const nextHandler = () => {
                if (nextStep.target instanceof HTMLElement) {
                    return true;
                }
                const selector = nextStep.target;
                return document.querySelector(selector) != null;
            };
            let mutationObserver;
            const mutationHandler = () => {
                if (nextHandler()) {
                    mutationObserver.disconnect();
                    const stepIndex = this.state.stepIndex + 1;
                    this.setState(Object.assign(Object.assign({}, this.state), { stepIndex, run: false }));
                }
            };
            mutationObserver = new MutationObserver(mutationHandler);
            mutationObserver.observe(document.body, {
                childList: true,
                attributes: true,
                subtree: true
            });
            mutationHandler();
        }
        if (callbackProps.status === react_joyride_1.STATUS.SKIPPED || callbackProps.status === react_joyride_1.STATUS.FINISHED) {
            try {
                switch (callbackProps.status) {
                    case react_joyride_1.STATUS.SKIPPED:
                        LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.TOUR_SKIPPED);
                        break;
                    case react_joyride_1.STATUS.FINISHED:
                        LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.TOUR_FINISHED);
                        break;
                }
            }
            finally {
                LifecycleToggle_1.LifecycleToggle.mark(LifecycleEvents_1.LifecycleEvents.TOUR_TERMINATED);
            }
        }
        else if (callbackProps.type === react_joyride_1.EVENTS.STEP_AFTER) {
            if (!this.state.run) {
                setTimeout(() => {
                    this.setState(Object.assign(Object.assign({}, this.state), { run: true }));
                }, 250);
                return;
            }
            this.doStep(callbackProps);
        }
        else if (callbackProps.type === react_joyride_1.EVENTS.TARGET_NOT_FOUND) {
            log.warn("Not found: ", callbackProps);
            this.doStep(callbackProps);
        }
    }
    doStep(callBackProps) {
        const stepIndex = callBackProps.index + (callBackProps.action === react_joyride_1.ACTIONS.PREV ? -1 : 1);
        this.setState(Object.assign(Object.assign({}, this.state), { stepIndex }));
    }
}
exports.RepositoryTour = RepositoryTour;
//# sourceMappingURL=RepositoryTour.js.map