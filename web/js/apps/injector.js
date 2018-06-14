// inject the right bundle depending on whether we're using chrome or electron.

const {Electron} = require("../Electron");
const {injectScript} = require("../utils.js");

if(Electron.isElectron()) {
    console.log("Injecting electron bundle");
    injectScript("../../web/dist/electron-bundle.js")
} else {
    console.log("Injecting chrome bundle");
    injectScript("../../web/dist/chrome-bundle.js")
}


