//import {BrowserWindow, ipcMain} from "electron";

import {BrowserWindow} from "electron";
/**
 * Client for controlling the ContentCaptureController.
 */
export class ContentCaptureClient {

    mainWindow: Electron.BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    requestNewCapture() {

        this.mainWindow.webContents.send("content-capture", {type: "request"});

        // ipcMain.once("content-capture");
        //
        // electron.ipcMain.on("content-capture", (event, message) => {
        //     console.log("FIXME: content-capture: ", message);
        //
        //     if(message.type === "content-capture-controller-started") {
        //         console.log("Ready to rock and roll.")
        //
        //         console.log("Requesting that content capture start");
        //         mainWindow.webContents.send("content-capture", {type: "request"});
        //
        //     }
        //
        //     if(message.type === "response") {
        //         console.log("got our response!");
        //         // we can now tell spectron what's up...
        //     }
        //
        // });

    }

}



