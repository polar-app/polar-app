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
exports.DataLoader = void 0;
const React = __importStar(require("react"));
const Alert_1 = __importDefault(require("@material-ui/lab/Alert"));
class DataLoader extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.unmounted = false;
        this.state = {
            data: undefined
        };
    }
    componentDidMount() {
        const onNext = (value) => {
            if (this.unmounted) {
                console.warn("DataLoader was unmounted but received event");
                return;
            }
            if (value) {
                const data = {
                    value,
                    err: undefined
                };
                this.setState({
                    data
                });
            }
            else {
                this.setState({
                    data: undefined
                });
            }
        };
        const onError = (err) => {
            const data = {
                err,
                value: undefined
            };
            this.setState({
                data
            });
        };
        this.unsubscriber = this.props.provider(onNext, onError);
    }
    componentWillUnmount() {
        this.unmounted = true;
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }
    render() {
        var _a;
        if (this.state.data && this.state.data.err) {
            if (this.props.error) {
                return this.props.error(this.state.data.err);
            }
            else {
                return (React.createElement(Alert_1.default, { severity: "error" },
                    "Error: ",
                    this.state.data.err.message));
            }
        }
        else {
            return this.props.render((_a = this.state.data) === null || _a === void 0 ? void 0 : _a.value);
        }
    }
}
exports.DataLoader = DataLoader;
//# sourceMappingURL=DataLoader.js.map