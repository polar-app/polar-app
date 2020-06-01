/**
 * Reader to allow Mocha to pull the results from spectron via the electron
 * renderer process.
 */

export interface TestResultReader {

    /**
     * Read the current value.
     *
     * @return {any}
     */
    read(): Promise<any>;

}
