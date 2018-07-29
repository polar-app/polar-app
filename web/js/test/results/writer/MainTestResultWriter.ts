import {Logger} from '../../../logger/Logger';
import {ipcMain} from "electron";
import {IPCMessage} from '../../../util/IPCMessage';

const log = Logger.create();

/**
 * Write data from the main Electron process.
 */
export class MainTestResultWriter {

    private mainWindow: Electron.BrowserWindow;

    constructor(mainWindow: Electron.BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    private ping(): Promise<void> {

        let pingMessage = new IPCMessage("ping", true);

        let result = new Promise<void>(resolve => {

            ipcMain.once("test-result", (event: any, message: IPCMessage) => {

                if(message.type === "pong") {

                    if(message.nonce === pingMessage.nonce) {
                        resolve();
                    } else {
                    }
                }

            });

        });

        this.mainWindow.webContents.send("test-result", pingMessage);

        return result;

    }

    async write(result: any): Promise<void> {

        // we need to ping first to make sure we actually get a response.
        await this.ping();

        if(result === null || result === undefined) {
            throw new Error("No result given!");
        }

        log.info("Writing test result: ", result);

        // use ipcMain to send the results to the TestResultService which is
        // running in the renderer
        this.mainWindow.webContents.send("test-result", {
            type: "write",
            result
        });

    }

}
