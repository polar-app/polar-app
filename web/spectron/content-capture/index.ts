import {ipcMain} from "electron";

const {SpectronRenderer} = require("../../js/test/SpectronRenderer");

async function start() {

    let mainWindow = await SpectronRenderer.start();
    mainWindow.loadFile(__dirname + '/app.html');

    // once the mainWindow is ready, tell it to capture the content.

    ipcMain.on("content-capture", (event, message) => {
        console.log("FIXME: content-capture: ", message);

        if(message.type === "content-capture-controller-started") {
            console.log("Ready to rock and roll.");

            console.log("Requesting that content capture start");
            mainWindow.webContents.send("content-capture", {type: "request"});

        }

        if(message.type === "response") {
            console.log("got our response!");
            // we can now tell spectron what's up...
        }

    });

}

start().catch(err => console.log(err));
