"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncBar = void 0;
const react_1 = __importDefault(require("react"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const LinearProgress_1 = __importDefault(require("@material-ui/core/LinearProgress"));
const log = Logger_1.Logger.create();
const Styles = {
    root: {},
    textBox: {
        position: 'fixed',
        left: '0',
        bottom: '5px',
        padding: '2px',
        fontSize: '12px',
        backgroundColor: '#F0F0EF',
        borderColor: '#D4D4D4',
        borderRadius: '0px 5px 0px 0px',
        minWidth: '250px',
        userSelect: 'none',
        zIndex: 99999999999,
    },
};
class SyncBar extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onProgress = this.onProgress.bind(this);
        this.state = {
            progress: undefined
        };
    }
    componentDidMount() {
        if (this.props.progress) {
            this.props.progress.addEventListener(progress => {
                log.info(`${progress.percentage}: ${progress.message}`);
                this.onProgress(progress);
            });
        }
    }
    componentWillUnmount() {
        if (this.listener && this.props.progress) {
            this.props.progress.removeEventListener(this.listener);
        }
    }
    render() {
        const progress = Math.floor(this.state.progress || 0);
        const isOpen = progress !== 0;
        if (!isOpen) {
            return null;
        }
        return (react_1.default.createElement("div", { style: Styles.root, className: "" },
            react_1.default.createElement("div", { style: Styles.textBox, className: "border-top border-right" }, this.state.message),
            react_1.default.createElement(LinearProgress_1.default, { variant: "determinate", value: progress })));
    }
    onProgress(progress) {
        this.setState({
            progress: progress.percentage,
            message: progress.message
        });
    }
}
exports.SyncBar = SyncBar;
//# sourceMappingURL=SyncBar.js.map