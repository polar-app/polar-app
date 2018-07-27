"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpectronMain_1 = require("../../js/test/SpectronMain");
SpectronMain_1.SpectronMain.run(state => {
    state.window.loadFile(__dirname + '/app.html');
    state.testResultWriter.write(true);
});
//# sourceMappingURL=index.js.map