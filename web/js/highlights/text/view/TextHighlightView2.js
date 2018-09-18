"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentManager_1 = require("../../../components/ComponentManager");
const DefaultContainerProvider_1 = require("../../../components/containers/providers/impl/DefaultContainerProvider");
const TextHighlightModel_1 = require("../model/TextHighlightModel");
const TextHighlightComponent_1 = require("./components/TextHighlightComponent");
class TextHighlightView2 {
    constructor(model) {
        this.componentManager = new ComponentManager_1.ComponentManager(model, new DefaultContainerProvider_1.DefaultContainerProvider(), () => new TextHighlightComponent_1.TextHighlightComponent(), () => new TextHighlightModel_1.TextHighlightModel());
    }
    start() {
        this.componentManager.start();
    }
}
exports.TextHighlightView2 = TextHighlightView2;
//# sourceMappingURL=TextHighlightView2.js.map