import {Logger} from '../../../logger/Logger';
import {BrowserWindow} from "electron";
import {TestResultWriter} from '../TestResultWriter';
import {Functions} from '../../../util/Functions';
import {TestResult} from '../renderer/TestResult';

const log = Logger.create();

/**
 * Write data from the main Electron process.
 */
export class MainTestResultWriter implements TestResultWriter {

    private mainWindow: Electron.BrowserWindow;


    constructor(mainWindow: Electron.BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    async write(result: any): Promise<void> {

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
