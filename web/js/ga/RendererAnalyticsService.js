"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RendererAnalyticsService = void 0;
const CIDProvider_1 = require("./CIDProvider");
class RendererAnalyticsService {
    start() {
        global.cidProvider = new CIDProvider_1.CIDProvider(undefined);
    }
}
exports.RendererAnalyticsService = RendererAnalyticsService;
//# sourceMappingURL=RendererAnalyticsService.js.map