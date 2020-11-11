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
exports.typedMemo = exports.useLogWhenChanged = exports.useRefValue = exports.useRefState = exports.useRefWithUpdates = exports.useRefProvider = void 0;
const React = __importStar(require("react"));
const deep_equal_1 = __importDefault(require("deep-equal"));
function useRefProvider(providerHook) {
    const value = providerHook();
    const ref = React.useRef(value);
    ref.current = value;
    return ref;
}
exports.useRefProvider = useRefProvider;
function useRefWithUpdates(value) {
    const ref = React.useRef(value);
    ref.current = value;
    return ref;
}
exports.useRefWithUpdates = useRefWithUpdates;
function useRefState(value) {
    const [state, setStateDelegate] = React.useState(value);
    const ref = React.useRef(value);
    function setState(newValue) {
        ref.current = newValue;
        setStateDelegate(newValue);
    }
    return [state, setState, ref];
}
exports.useRefState = useRefState;
function useRefValue(value) {
    const ref = React.useRef(value);
    ref.current = value;
    return ref;
}
exports.useRefValue = useRefValue;
function pprint(value) {
    if (value === undefined) {
        return 'undefined';
    }
    else if (value === null) {
        return 'null';
    }
    else if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    else {
        return value.toString();
    }
}
function useLogWhenChanged(name, value) {
    const previous = React.useRef(value);
    try {
        const info = `prev: ${pprint(previous.current)}, curr: ${pprint(value)}`;
        if (!deep_equal_1.default(previous.current, value)) {
            console.log(`${name} changed: ${info}`);
        }
        else {
            console.log(`${name} NOT changed: ${info}`);
        }
    }
    finally {
        previous.current = value;
    }
}
exports.useLogWhenChanged = useLogWhenChanged;
exports.typedMemo = React.memo;
//# sourceMappingURL=ReactHooks.js.map