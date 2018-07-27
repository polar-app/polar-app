import {TestResultService} from './results/TestResultService';

export class SpectronRenderer {

    static setup() {
        new TestResultService().start();
    }

    static start(callback: RunCallback): Promise<void> {
        SpectronRenderer.setup();
        return callback();
    }

    static run(callback: RunCallback) {
        SpectronRenderer.setup();
        callback().catch(err => console.error(err));
    }

}

export interface RunCallback {
    (): Promise<void>
}

