/**
 * State of the current spectron test including APIs for working with spectron.
 */
import {TestResultReader} from './results/TestResultReader';

export class SpectronState {

    public readonly testResultReader: TestResultReader;

    constructor(testResultReader: TestResultReader) {
        this.testResultReader = testResultReader;
    }

}
