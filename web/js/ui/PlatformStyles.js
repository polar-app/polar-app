"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformStyles = void 0;
const Platforms_1 = require("polar-shared/src/util/Platforms");
class PlatformStyles {
    static assign() {
        const platform = Platforms_1.Platforms.get();
        const platformSymbol = Platforms_1.Platforms.toSymbol(platform);
        const targetElement = document.documentElement;
        targetElement.setAttribute('data-platform', platformSymbol.toLowerCase());
    }
}
exports.PlatformStyles = PlatformStyles;
//# sourceMappingURL=PlatformStyles.js.map