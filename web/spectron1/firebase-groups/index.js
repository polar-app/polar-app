"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpectronWebappMain_1 = require("../../js/test/SpectronWebappMain");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const FirebaseTesting_1 = require("../../js/firebase/FirebaseTesting");
FirebaseTesting_1.FirebaseTesting.validateUsers();
const webRoot = FilePaths_1.FilePaths.join(__dirname, "..", "..", "..");
const appRoot = __dirname;
SpectronWebappMain_1.SpectronWebappMain.run({ webRoot, appRoot, path: "/web/spectron1/firebase-groups/content.html" });
//# sourceMappingURL=index.js.map