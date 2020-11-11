"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUpdates = void 0;
const Platforms_1 = require("polar-shared/src/util/Platforms");
const DistConfig_1 = require("../dist_config/DistConfig");
class AppUpdates {
    static platformSupportsUpdates() {
        return [Platforms_1.Platform.MACOS, Platforms_1.Platform.WINDOWS].includes(Platforms_1.Platforms.get()) && DistConfig_1.DistConfig.ENABLE_UPDATES;
    }
}
exports.AppUpdates = AppUpdates;
//# sourceMappingURL=AppUpdates.js.map