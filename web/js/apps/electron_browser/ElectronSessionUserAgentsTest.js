"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ElectronUserAgents_1 = require("./ElectronUserAgents");
describe('ElectronSessionUserAgents', function () {
    it("basic", function () {
        const before = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) polar-bookshelf/1.60.14 Chrome/73.0.3683.121 Electron/5.0.11 Safari/537.36";
        const after = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.121 Safari/537.36";
        chai_1.assert.equal(ElectronUserAgents_1.ElectronUserAgents.computeUserAgentFromString(before), after);
    });
});
//# sourceMappingURL=ElectronSessionUserAgentsTest.js.map