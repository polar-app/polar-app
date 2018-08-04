"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardCreatorElement_1 = require("./CardCreatorElement");
class CardCreatorWebComponent {
    static register() {
        customElements.define("card-creator", CardCreatorElement_1.CardCreatorElement, { extends: "div" });
        console.log("FIXME: registered card creator.");
    }
}
exports.CardCreatorWebComponent = CardCreatorWebComponent;
//# sourceMappingURL=CardCreatorWebComponent.js.map