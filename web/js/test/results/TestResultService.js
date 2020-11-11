"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResultService = void 0;
const electron_1 = require("electron");
const Logger_1 = require("polar-shared/src/logger/Logger");
const TestResult_1 = require("./renderer/TestResult");
const IPCMessage_1 = require("../../ipc/handler/IPCMessage");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const log = Logger_1.Logger.create();
class TestResultService {
    start() {
        Preconditions_1.Preconditions.assertPresent(electron_1.ipcRenderer, "No ipcRenderer");
        electron_1.ipcRenderer.on('test-result', (event, data) => {
            const ipcMessage = IPCMessage_1.IPCMessage.create(data);
            if (ipcMessage.type === "write") {
                this.onWrite(ipcMessage);
            }
            if (ipcMessage.type === "ping") {
                this.onPing(event, ipcMessage);
            }
        });
        electron_1.ipcRenderer.send("test-result", { type: "started" });
    }
    onPing(event, ipcMessage) {
        const pongMessage = new IPCMessage_1.IPCMessage("pong", true);
        event.sender.send(ipcMessage.computeResponseChannel(), pongMessage);
    }
    onWrite(data) {
        if (!Optional_1.Optional.present(TestResult_1.TestResult.get())) {
            const ipcMessage = IPCMessage_1.IPCMessage.create(data);
            if (Optional_1.Optional.present(ipcMessage.value)) {
                TestResult_1.TestResult.set(ipcMessage.value);
                log.info("Received test result: " + JSON.stringify(TestResult_1.TestResult.get()));
            }
            else if (data.err) {
            }
            else {
                log.error("Given neither result nor err: ", data);
            }
        }
        else {
            log.error("Existing test results already defined.: " + data.value);
        }
    }
}
exports.TestResultService = TestResultService;
//# sourceMappingURL=TestResultService.js.map