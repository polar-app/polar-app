"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("../Model");
const ViewerFactory_1 = require("../viewer/ViewerFactory");
const { SystemClock } = require("../time/SystemClock.js");
const { WebController } = require("../controller/WebController.js");
const { WebView } = require("../view/WebView.js");
const { TextHighlightView } = require("../highlights/text/view/TextHighlightView");
const { TextHighlightView2 } = require("../highlights/text/view/TextHighlightView2");
const { PagemarkView, PAGEMARK_VIEW_ENABLED } = require("../pagemarks/view/PagemarkView");
const { PagemarkController } = require("../pagemarks/controller/PagemarkController");
const { AreaHighlightView } = require("../highlights/area/view/AreaHighlightView");
class Launcher {
    constructor(persistenceLayerFactory) {
        this.persistenceLayerFactory = persistenceLayerFactory;
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            let persistenceLayer = yield this.persistenceLayerFactory();
            let model = new Model_1.Model(persistenceLayer);
            new WebView(model).start();
            new TextHighlightView2(model).start();
            new AreaHighlightView(model).start();
            if (PAGEMARK_VIEW_ENABLED) {
                new PagemarkView(model).start();
            }
            let viewer = ViewerFactory_1.ViewerFactory.create(model);
            viewer.start();
            yield persistenceLayer.init();
            yield new WebController(model, viewer).start();
        });
    }
    launch() {
        return __awaiter(this, void 0, void 0, function* () {
            if (document.readyState === "interactive" || document.readyState === "complete") {
                console.log("Already completed loading.");
                yield this.trigger();
            }
            else {
                console.log("Waiting for DOM content to load");
                document.addEventListener('DOMContentLoaded', this.trigger.bind(this), true);
            }
        });
    }
}
exports.Launcher = Launcher;
//# sourceMappingURL=Launcher.js.map