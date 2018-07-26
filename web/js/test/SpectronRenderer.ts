import {TestResultsService} from './results/TestResultsService';

export class SpectronRenderer {

    static setup() {
        new TestResultsService().start();
    }

}
