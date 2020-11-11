"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToasterMessages = void 0;
const Broadcasters_1 = require("../../ipc/Broadcasters");
class ToasterMessages {
    static send(message) {
        Broadcasters_1.Broadcasters.send(this.CHANNEL, message);
    }
}
exports.ToasterMessages = ToasterMessages;
ToasterMessages.CHANNEL = '/toaster-message';
//# sourceMappingURL=ToasterMessages.js.map