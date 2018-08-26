"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Container {
    constructor(opts = {}) {
        this.components = [];
        this.id = opts.id;
        this.element = opts.element;
        this.components = opts.components || [];
    }
    addComponent(component) {
        this.components.push(component);
    }
    getComponents() {
        return this.components;
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map