"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channels = void 0;
class Channels {
    static create() {
        let target = (value) => {
        };
        const channelCoupler = (actual) => {
            target = actual;
        };
        const channel = (value) => {
            target(value);
        };
        return [channel, channelCoupler];
    }
}
exports.Channels = Channels;
//# sourceMappingURL=Channels.js.map