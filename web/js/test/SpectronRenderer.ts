import {TestResultService} from './results/TestResultService';

export class SpectronRenderer {

    static setup() {
        new TestResultService().start();
    }

}
