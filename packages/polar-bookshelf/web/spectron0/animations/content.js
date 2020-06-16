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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpectronRenderer_1 = require("../../js/test/SpectronRenderer");
const ReactDOM = __importStar(require("react-dom"));
const React = __importStar(require("react"));
const App_1 = require("./App");
SpectronRenderer_1.SpectronRenderer.run(() => __awaiter(void 0, void 0, void 0, function* () {
    ReactDOM.render(React.createElement(App_1.App, null), document.getElementById('root'));
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRlbnQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFFQUFnRTtBQUNoRSxvREFBc0M7QUFDdEMsNkNBQStCO0FBQy9CLCtCQUEwQjtBQUUxQixtQ0FBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBUyxFQUFFO0lBRTVCLFFBQVEsQ0FBQyxNQUFNLENBQ1gsb0JBQUMsU0FBRyxPQUFHLEVBQ1AsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQWdCLENBQ2pELENBQUM7QUFFTixDQUFDLENBQUEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTcGVjdHJvblJlbmRlcmVyfSBmcm9tICcuLi8uLi9qcy90ZXN0L1NwZWN0cm9uUmVuZGVyZXInO1xuaW1wb3J0ICogYXMgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7QXBwfSBmcm9tICcuL0FwcCc7XG5cblNwZWN0cm9uUmVuZGVyZXIucnVuKGFzeW5jICgpID0+IHtcblxuICAgIFJlYWN0RE9NLnJlbmRlcihcbiAgICAgICAgPEFwcCAvPixcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSBhcyBIVE1MRWxlbWVudFxuICAgICk7XG5cbn0pO1xuIl19