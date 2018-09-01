import {Logger} from '../../../logger/Logger';
import {BrowserWindow, ipcMain} from "electron";
import {IPCMessage} from '../../../ipc/handler/IPCMessage';
import {TestResultWriter} from '../TestResultWriter';
import {Functions} from '../../../util/Functions';
import {TestResult} from '../renderer/TestResult';

const log = Logger.create();

/**
 * Write data from the main Electron process.
 */
export class MainTestResultWriter implements TestResultWriter {

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

        let browserWindows = BrowserWindow.getAllWindows();

        for (let idx = 0; idx < browserWindows.length; idx++) {
            const browserWindow = browserWindows[idx];

            let script = Functions.toScript(TestResult.set, result);

            await browserWindow.webContents.executeJavaScript(script);

        }

    }

}
