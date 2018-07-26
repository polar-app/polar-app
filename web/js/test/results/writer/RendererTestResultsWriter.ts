import {ipcMain} from 'electron';
import {TestResultWriter} from '../TestResultWriter';

/**
 * Write data from the main Electron process.
 */
export class RendererTestResultsWriter implements TestResultWriter {

    write(result: any): void {

        if(! result) {
            throw new Error("No result given!");
        }

    }

}
