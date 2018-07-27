import {TestResultWriter} from '../TestResultWriter';
import {Logger} from '../../../logger/Logger';
import {ipcMain} from "electron";

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

    async write(result: any): Promise<void> {

        await this.waitForServicePromise;

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
