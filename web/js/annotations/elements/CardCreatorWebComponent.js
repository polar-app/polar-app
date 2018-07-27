"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CardCreatorElement_1 = require("./CardCreatorElement");
var CardCreatorWebComponent = /** @class */ (function () {
    function CardCreatorWebComponent() {
    }
    CardCreatorWebComponent.register = function () {
        // if (document.getElementById("card-creator-import")) {
        //     // we're already registered
        //     return;
        // }
        // let link = document.createElement("link");
        // TODO: the only reason we're using the webcomponent.html file is for
        // CSS.  It seems like it might be a better idea for me to be using
        // webpack for this too.
        // link.setAttribute("rel", "import");
        // link.setAttribute("href", "/apps/card-creator/webcomponent.html");
        customElements.define("card-creator", CardCreatorElement_1.CardCreatorElement, { extends: "div" });
        console.log("FIXME: registered card creator.");
    };
    return CardCreatorWebComponent;
}());
exports.CardCreatorWebComponent = CardCreatorWebComponent;
//# sourceMappingURL=CardCreatorWebComponent.js.map