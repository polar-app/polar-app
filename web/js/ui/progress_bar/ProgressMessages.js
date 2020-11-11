"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressMessages = void 0;
const Broadcasters_1 = require("../../ipc/Broadcasters");
const Messenger_1 = require("../../electron/messenger/Messenger");
const Logger_1 = require("polar-shared/src/logger/Logger");
const AppRuntime_1 = require("../../AppRuntime");
const log = Logger_1.Logger.create();
class ProgressMessages {
    static broadcast(progressMessage) {
        if (AppRuntime_1.AppRuntime.get() === 'electron-main') {
            Broadcasters_1.Broadcasters.send(this.CHANNEL, progressMessage);
        }
        else {
            const message = {
                type: this.CHANNEL,
                value: progressMessage
            };
            Messenger_1.Messenger.postMessage({ message })
                .catch(err => log.error("Could not send message: ", err));
        }
    }
}
exports.ProgressMessages = ProgressMessages;
ProgressMessages.CHANNEL = '/progress-message';
//# sourceMappingURL=ProgressMessages.js.map