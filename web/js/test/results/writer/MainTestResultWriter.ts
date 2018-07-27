import {TestResultWriter} from '../TestResultWriter';

/**
 * Write data from the main Electron process.
 */
export class MainTestResultWriter implements TestResultWriter {

    private mainWindow: Electron.BrowserWindow;

    constructor(mainWindow: Electron.BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    write(result: any): void {

        if(result === null || result === undefined) {
            throw new Error("No result given!");
        }

        // use ipcMain to send the results to the TestResultService which is
        // running in the renderer
        this.mainWindow.webContents.send("test-results", {
            type: "write",
            result
        });

        // TODO: do we need to ack the write?

    }

}
