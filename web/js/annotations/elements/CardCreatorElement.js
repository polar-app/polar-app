"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CardCreatorElement = /** @class */ (function (_super) {
    __extends(CardCreatorElement, _super);
    function CardCreatorElement() {
        var _this = _super.call(this) || this;
        // let importDoc = document.currentScript.ownerDocument;
        //
        // let template = importDoc.querySelector("template");
        //
        // //let cloneElement = this.importNode(template.content, true);
        var shadowRoot = _this.attachShadow({ mode: 'open' });
        var textElement = document.createElement("div");
        textElement.textContent = "hello world";
        shadowRoot.appendChild(textElement);
        return _this;
    }
    return CardCreatorElement;
}(HTMLDivElement));
exports.CardCreatorElement = CardCreatorElement;
//# sourceMappingURL=CardCreatorElement.js.map