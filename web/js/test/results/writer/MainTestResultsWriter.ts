import {ipcMain} from 'electron';
import {TestResultsWriter} from '../TestResultsWriter';

/**
 * Write data from the main Electron process.
 */
export class MainTestResultsWriter implements TestResultsWriter {

    private mainWindow: Electron.BrowserWindow;

    constructor(mainWindow: Electron.BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    write(result: any): void {

        if(! result) {
            throw new Error("No result given!");
        }

        // use ipcMain to send the results to the TestResultsService which is
        // running in the renderer
        this.mainWindow.webContents.send("test-results", {
            type: "write",
            result
        });

        // TODO: do we need to ack the write?

    }

}
