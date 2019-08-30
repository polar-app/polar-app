"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpectronRenderer_1 = require("../../js/test/SpectronRenderer");
const ReactDOM = __importStar(require("react-dom"));
const React = __importStar(require("react"));
const App_1 = __importDefault(require("./App"));
SpectronRenderer_1.SpectronRenderer.run(() => __awaiter(this, void 0, void 0, function* () {
    ReactDOM.render(React.createElement(App_1.default, null), document.getElementById('root'));
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUVBQWdFO0FBQ2hFLG9EQUFzQztBQUN0Qyw2Q0FBK0I7QUFDL0IsZ0RBQXdCO0FBRXhCLG1DQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFTLEVBQUU7SUFFNUIsUUFBUSxDQUFDLE1BQU0sQ0FDWCxvQkFBQyxhQUFHLE9BQUcsRUFDUCxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBZ0IsQ0FDakQsQ0FBQztBQUVOLENBQUMsQ0FBQSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NwZWN0cm9uUmVuZGVyZXJ9IGZyb20gJy4uLy4uL2pzL3Rlc3QvU3BlY3Ryb25SZW5kZXJlcic7XG5pbXBvcnQgKiBhcyBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEFwcCBmcm9tICcuL0FwcCc7XG5cblNwZWN0cm9uUmVuZGVyZXIucnVuKGFzeW5jICgpID0+IHtcblxuICAgIFJlYWN0RE9NLnJlbmRlcihcbiAgICAgICAgPEFwcCAvPixcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSBhcyBIVE1MRWxlbWVudFxuICAgICk7XG5cbn0pO1xuIl19