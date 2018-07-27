"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CardCreatorElement extends HTMLElement {
    constructor() {
        super();
        // let importDoc = document.currentScript.ownerDocument;
        //
        // let template = importDoc.querySelector("template");
        //
        // //let cloneElement = this.importNode(template.content, true);
        let shadowRoot = this.attachShadow({ mode: 'open' });
        let textElement = document.createElement("div");
        textElement.textContent = "hello world";
        shadowRoot.appendChild(textElement);
    }
}
exports.CardCreatorElement = CardCreatorElement;
//# sourceMappingURL=CardCreatorElement.js.map