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
exports.LogMessagesDataLoader = void 0;
const React = __importStar(require("react"));
const DataLoader_1 = require("../data_loader/DataLoader");
const MemoryLogger_1 = require("../../logger/MemoryLogger");
const Arrays_1 = require("polar-shared/src/util/Arrays");
class LogMessagesDataLoader extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const provider = (onNext) => {
            let buffer = [];
            const releasable = MemoryLogger_1.MemoryLogger.addEventListener(event => {
                buffer.push({
                    id: "idx:" + event.idx,
                    timestamp: event.timestamp,
                    level: event.level,
                    msg: event.msg
                });
                buffer = Arrays_1.Arrays.head(buffer, 3);
                const logData = {
                    messages: [...buffer]
                };
                onNext(logData);
            });
            return () => {
                releasable.release();
            };
        };
        return (React.createElement(DataLoader_1.DataLoader, { id: "log-messages", provider: provider, render: (messages) => this.props.render(messages) }));
    }
}
exports.LogMessagesDataLoader = LogMessagesDataLoader;
//# sourceMappingURL=LogMessagesDataLoader.js.map