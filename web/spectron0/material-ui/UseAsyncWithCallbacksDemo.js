"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseAsyncWithCallbacksDemo = void 0;
const react_async_1 = require("react-async");
const react_1 = __importDefault(require("react"));
function doAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        return "hello world";
    });
}
exports.UseAsyncWithCallbacksDemo = () => {
    const [data, setData] = react_1.default.useState("none");
    const handleCallback = react_1.default.useCallback(() => {
        const { data, error } = react_async_1.useAsync({ promiseFn: doAsync });
        if (data) {
            setData(data);
        }
    }, []);
    return (react_1.default.createElement("div", { onClick: handleCallback }, data));
};
//# sourceMappingURL=UseAsyncWithCallbacksDemo.js.map