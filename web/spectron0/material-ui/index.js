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
const SpectronWebappMain_1 = require("../../js/test/SpectronWebappMain");
const ElectronGlobalDatastore_1 = require("../../js/datastore/ElectronGlobalDatastore");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const webRoot = FilePaths_1.FilePaths.join(__dirname, "..", "..", "..");
const appRoot = webRoot;
const rewrites = [
    {
        source: "/",
        destination: "content.html"
    },
];
const datastore = ElectronGlobalDatastore_1.ElectronGlobalDatastore.create();
const path = "/web/spectron0/material-ui/content.html";
SpectronWebappMain_1.SpectronWebappMain.run({
    initializer: () => __awaiter(void 0, void 0, void 0, function* () { return yield datastore.init(); }),
    webRoot,
    appRoot,
    path,
    rewrites
});
//# sourceMappingURL=index.js.map