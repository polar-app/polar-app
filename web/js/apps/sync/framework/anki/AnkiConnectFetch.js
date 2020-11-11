"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnkiConnectFetch = void 0;
const Fetch_1 = require("polar-shared/src/util/Fetch");
const Logger_1 = require("polar-shared/src/logger/Logger");
const AnkiSyncError_1 = require("./AnkiSyncError");
const log = Logger_1.Logger.create();
class AnkiConnectFetch {
    static initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const detectPort = () => __awaiter(this, void 0, void 0, function* () {
                for (const port of this.PORTS) {
                    try {
                        const body = {
                            action: "version",
                            version: 6,
                            params: {}
                        };
                        const init = { method: 'POST', body: JSON.stringify(body) };
                        yield AnkiConnectFetch.fetch(init, port);
                        return port;
                    }
                    catch (e) {
                        console.error("Unable to connect on port: " + port, e);
                    }
                }
                const msg = `Unable to connect to anki with ports ${this.PORTS} (make sure Anki Connect is installed)`;
                log.error(msg);
                throw new AnkiSyncError_1.AnkiSyncError(msg, 'no-anki-connect');
            });
            const configurePort = () => __awaiter(this, void 0, void 0, function* () {
                this.port = yield detectPort();
                log.notice("Using Anki sync port: " + this.port);
            });
            yield configurePort();
        });
    }
    static fetch(init, port = this.port) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                init = Object.assign(Object.assign({}, init), { cache: 'no-cache', headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    } });
                const response = yield Fetch_1.Fetches.fetch('http://127.0.0.1:' + port, init);
                const result = yield response.json();
                if (result.error) {
                    throw new Error(result.error);
                }
                return result.result;
            }
            catch (e) {
                log.warn("Anki connect fetch failed (install Anki Connect): ", e);
                throw e;
            }
        });
    }
}
exports.AnkiConnectFetch = AnkiConnectFetch;
AnkiConnectFetch.PORTS = [8765];
AnkiConnectFetch.port = 8765;
//# sourceMappingURL=AnkiConnectFetch.js.map