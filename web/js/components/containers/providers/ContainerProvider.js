"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../Container");
class ContainerProvider {
    getContainers() {
        throw new Error("Not implemented");
    }
    _getContainers(selector) {
        let result = {};
        let elements = Array.from(document.querySelectorAll(selector));
        elements.forEach(element => {
            let id = parseInt(element.getAttribute("data-page-number"));
            let container = new Container_1.Container({ id, element });
            result[id] = container;
        });
        return result;
    }
    createContainerLifecycleListener(container) {
        throw new Error("Not implemented");
    }
}
exports.ContainerProvider = ContainerProvider;
//# sourceMappingURL=ContainerProvider.js.map