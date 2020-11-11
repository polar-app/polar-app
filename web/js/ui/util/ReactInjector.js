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
exports.InjectedComponent = exports.ReactInjector = void 0;
const ReactDOM = __importStar(require("react-dom"));
var ReactInjector;
(function (ReactInjector) {
    function inject(element, opts = {}) {
        const { id } = opts;
        const doc = opts.doc || document;
        const root = opts.root || doc.body;
        let container = doc.createElement('div');
        if (id) {
            const existingContainer = doc.getElementById(id);
            if (existingContainer) {
                return new InjectedComponent(existingContainer);
            }
            else {
                container = doc.createElement('div');
                container.setAttribute('id', id);
            }
        }
        root.appendChild(container);
        return create(element, container);
    }
    ReactInjector.inject = inject;
    function create(element, container) {
        ReactDOM.render(element, container);
        return new InjectedComponent(container);
    }
    ReactInjector.create = create;
})(ReactInjector = exports.ReactInjector || (exports.ReactInjector = {}));
class InjectedComponent {
    constructor(container) {
        this.container = container;
    }
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
            this.container.parentElement.removeChild(this.container);
            this.container = null;
        }
        else {
        }
    }
}
exports.InjectedComponent = InjectedComponent;
//# sourceMappingURL=ReactInjector.js.map