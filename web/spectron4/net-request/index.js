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
const SpectronMain2_1 = require("../../js/test/SpectronMain2");
const electron_1 = require("electron");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
SpectronMain2_1.SpectronMain2.create().run((state) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        method: "GET",
        url: 'https://www.cnn.com',
    };
    const netRequest = electron_1.net.request(options)
        .on('response', (response) => __awaiter(void 0, void 0, void 0, function* () {
        response.on('data', chunk => {
            console.log("GOT CHUNK:", chunk);
        });
        response.on('end', () => {
            console.log("GOT END");
        });
    }))
        .on('abort', () => {
        log.error(`Request aborted: ${options.url}`);
    })
        .on('error', (error) => {
        log.error(`Request error: ${options.url}`, error);
    });
    netRequest.end();
    yield state.testResultWriter.write(true);
}));
//# sourceMappingURL=index.js.map