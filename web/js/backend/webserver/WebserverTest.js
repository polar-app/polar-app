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
const FilePaths_1 = require("../../util/FilePaths");
const Files_1 = require("../../util/Files");
const WebserverConfig_1 = require("./WebserverConfig");
const FileRegistry_1 = require("./FileRegistry");
const Webserver_1 = require("./Webserver");
const Hashcodes_1 = require("../../Hashcodes");
const Assertions_1 = require("../../test/Assertions");
const Http_1 = require("../../util/Http");
const chai_1 = require("chai");
describe('Webserver', function () {
    describe('create', function () {
        it("basic", function () {
            let webserverConfig = new WebserverConfig_1.WebserverConfig("..", 8085);
            let fileRegistry = new FileRegistry_1.FileRegistry(webserverConfig);
            let webserver = new Webserver_1.Webserver(webserverConfig, fileRegistry);
            webserver.start();
            webserver.stop();
        });
        it("registerFile", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let webserverConfig = new WebserverConfig_1.WebserverConfig("..", 8095);
                let fileRegistry = new FileRegistry_1.FileRegistry(webserverConfig);
                let webserver = new Webserver_1.Webserver(webserverConfig, fileRegistry);
                webserver.start();
                let path = FilePaths_1.FilePaths.tmpfile('file-registry.html');
                yield Files_1.Files.writeFileAsync(path, 'hello world');
                let fileMeta = fileRegistry.register("0x000", path);
                chai_1.assert.ok(fileMeta.url !== undefined);
                let buffer = yield Files_1.Files.readFileAsync(path);
                let hashcode = Hashcodes_1.Hashcodes.create(buffer.toString('utf-8'));
                let expected = {
                    "key": "0x000",
                    "filename": path,
                    "url": "http://127.0.0.1:8095/files/0x000"
                };
                Assertions_1.assertJSON(fileMeta, expected);
                let response = yield Http_1.Http.execute(fileMeta.url);
                Assertions_1.assertJSON(hashcode, Hashcodes_1.Hashcodes.create(response.data.toString('utf8')));
                webserver.stop();
            });
        });
    });
});
//# sourceMappingURL=WebserverTest.js.map