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
exports.App = void 0;
const React = __importStar(require("react"));
const Tags_1 = require("polar-shared/src/tags/Tags");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const TasksCalculator_1 = require("polar-spaced-repetition/src/spaced_repetition/scheduler/S2Plus/TasksCalculator");
const Lorems_1 = require("polar-shared/src/util/Lorems");
const react_router_dom_1 = require("react-router-dom");
const AccountControl_1 = require("../../js/ui/cloud_auth/AccountControl");
const styles = {
    swatch: {
        width: '30px',
        height: '30px',
        float: 'left',
        borderRadius: '4px',
        margin: '0 6px 6px 0',
    }
};
const Folders = () => {
    return React.createElement("div", { style: { backgroundColor: 'red', overflow: 'auto' } }, "these are the folders");
};
const Preview = () => {
    return React.createElement("div", { style: { backgroundColor: 'orange', overflow: 'auto' } }, "This is the preview");
};
const Main = () => {
    return React.createElement("div", { style: { backgroundColor: 'blue' } }, "this is the right");
};
class App extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const tags = [
            '/CompSci/Google',
            '/CompSci/Linux',
            '/CompSci/Microsoft',
            '/CompSci/Programming Languages/C++',
            '/CompSci/Programming Languages/Java',
            '/History/WWII',
            '/History/United States/WWII',
        ].map(current => Tags_1.Tags.create(current))
            .map(current => {
            const count = Math.floor(Math.random() * 100);
            return Object.assign(Object.assign({}, current), { count });
        });
        const group = {
            nrMembers: 100,
            name: 'Linux',
            description: "A group about Linux, Ubuntu, Debian, and UNIX operating systems.",
            id: "101",
            visibility: 'public',
            created: ISODateTimeStrings_1.ISODateTimeStrings.create()
        };
        const keyBindingHandler = (event) => {
            if (event.key === 'F') {
                console.log("YUP!");
            }
        };
        const createReadingTaskReps = () => {
            const lorem = Lorems_1.Lorems.mediumLength();
            const tasks = [
                {
                    id: "10102",
                    action: lorem,
                    created: ISODateTimeStrings_1.ISODateTimeStrings.create(),
                    color: 'red',
                    mode: 'reading'
                },
                {
                    id: "10101",
                    action: "this is the first one",
                    created: ISODateTimeStrings_1.ISODateTimeStrings.create(),
                    color: 'yellow',
                    mode: 'reading'
                },
                {
                    id: "10102",
                    action: "this is the second one",
                    created: ISODateTimeStrings_1.ISODateTimeStrings.create(),
                    color: 'yellow',
                    mode: 'reading'
                },
            ];
            return tasks.map(task => TasksCalculator_1.TasksCalculator.createInitialLearningState(task));
        };
        const MockTag = (props) => {
            return React.createElement("div", { className: "bg-grey100 p-1 rounded mr-1", style: {
                    display: 'inline-block'
                } },
                props.children,
                React.createElement("span", { className: "text-sm" }));
        };
        const StartReview = () => React.createElement("div", null, "start review");
        const DefaultContent = () => React.createElement("div", null,
            React.createElement(react_router_dom_1.Link, { to: { hash: '#start-review' } }, "start review with router"));
        const userInfo = {
            displayName: "Kevin Burton",
            email: "burton@example.com",
            emailVerified: true,
            photoURL: 'https://lh5.googleusercontent.com/-BldJH1bae3o/AAAAAAAAAAI/AAAAAAAAADY/Di36-YNrKqk/photo.jpg',
            uid: "12345",
            creationTime: ISODateTimeStrings_1.ISODateTimeStrings.create(),
            subscription: {
                plan: 'bronze',
                interval: 'month'
            }
        };
        const defaultComponent = () => {
            return (React.createElement("div", { style: {
                    maxWidth: 400
                }, className: "border p-1 shadow" },
                React.createElement(AccountControl_1.AccountControl, { userInfo: userInfo })));
        };
        const Joiner = () => (React.createElement("div", { style: {
                display: 'flex',
                flexDirection: 'column',
                width: '50px',
                borderWidth: '2px'
            } },
            React.createElement("div", { className: "ml-2 mr-2", style: {
                    borderBottom: '2px solid var(--secondary)',
                    height: '35px'
                } }),
            React.createElement("div", { className: "border-secondary border-top mb-auto" })));
        const dockPanels = [
            {
                id: "left-sidebar",
                type: 'fixed',
                component: React.createElement("div", null, "left"),
                width: 350
            },
            {
                id: "main",
                type: 'grow',
                component: React.createElement("div", null, "main"),
                grow: 1
            },
            {
                id: "right-sidebar",
                type: 'fixed',
                component: React.createElement("div", null, "right"),
                width: 350
            }
        ];
        return (React.createElement("div", { className: "p-1" }));
    }
}
exports.App = App;
//# sourceMappingURL=App2.js.map