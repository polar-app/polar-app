/**
 * Reader to allow Mocha to pull the results from spectron via the electron
 * renderer process.
 */
import {Result} from '../../util/Result';

export abstract class TestResultReader {

    /**
     * Read the current value.
     *
     * @return {any}
     */
    abstract async read(): Promise<Result<any>>;

}
