import {TestResultWriter} from '../TestResultWriter';
import {TestResult} from '../renderer/TestResult';

/**
 * Write data from the main Electron process.
 */
export class RendererTestResultsWriter implements TestResultWriter {

    write(result: any): void {

        if(! result) {
            throw new Error("No result given!");
        }

        TestResult.set(result);

    }

}
