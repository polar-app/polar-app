import {TestResultWriter} from '../TestResultWriter';
import {TestResult} from '../renderer/TestResult';
import {Logger} from '../../../logger/Logger';

const log = Logger.create();
/**
 * Write data from the main Electron process.
 */
export class RendererTestResultWriter implements TestResultWriter {

    write(result: any): void {

        log.info("Got result from renderer: ", result);

        if(! result) {
            throw new Error("No result given!");
        }

        TestResult.set(result);

    }

}
