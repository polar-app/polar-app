import {Logger} from '../../../logger/Logger';
import {ipcMain} from "electron";
import {IPCMessage} from '../../../ipc/handler/IPCMessage';

const log = Logger.create();

/**
 * Write data from the main Electron process.
 */
export class MainTestResultWriter {

    private mainWindow: Electron.BrowserWindow;

    private readonly waitForServicePromise: Promise<void>;

    constructor(mainWindow: Electron.BrowserWindow) {
        this.mainWindow = mainWindow;
        this.waitForServicePromise = this.waitForService();
    }

    waitForService(): Promise<void> {

        return new Promise(resolve => {

            ipcMain.once("test-result", (event: any, message: any) => {

                if(message.type === "started") {
                    resolve();
                }

            });

        });

    }


    private ping(): Promise<void> {

        let pingMessage = new IPCMessage("ping", true);

        let result = new Promise<void>(resolve => {

            ipcMain.once(pingMessage.computeResponseChannel(), (event: any, message: IPCMessage<any>) => {
                resolve();
            });

        });

        this.mainWindow.webContents.send("test-result", pingMessage);

        return result;

    }

    async write(result: any): Promise<void> {

        await this.waitForServicePromise;

        // we need to ping first to make sure we actually get a response.
        await this.ping();

        if(result === null || result === undefined) {
            throw new Error("No result given!");
        }

        log.info("Writing test result: ", result);

        let ipcMessage = new IPCMessage('write', result);

        // use ipcMain to send the results to the TestResultService which is
        // running in the renderer
        this.mainWindow.webContents.send("test-result", ipcMessage);

    }

}
