import {TestResultService} from './results/TestResultService';

export class SpectronRenderer {

    static setup() {
        new TestResultService().start();
    }

    static run(callback: RunCallback) {
        SpectronRenderer.setup();
        callback();
    }

}

export interface RunCallback {
    (): void
}

