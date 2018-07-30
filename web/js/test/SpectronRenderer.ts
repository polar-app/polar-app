
import {ipcRenderer} from 'electron';
import {TestResultService} from './results/TestResultService';
import {RendererTestResultWriter} from './results/writer/RendererTestResultWriter';

export class SpectronRenderer {

    static setup() {
        new TestResultService().start();
    }

    static start(callback: RunCallback): Promise<void> {
        SpectronRenderer.setup();
        let testResultWriter = new RendererTestResultWriter();
        let state = new SpectronRendererState(testResultWriter);

        let result = callback(state);

        ipcRenderer.send('spectron-renderer-started', true);

        return result;

    }

    static run(callback: RunCallback) {
        this.start(callback)
            .catch(err => console.error(err));
    }

}

export interface RunCallback {
    (state: SpectronRendererState): Promise<void>
}


export class SpectronRendererState {

    public readonly testResultWriter: RendererTestResultWriter;

    constructor(testResultWriter: RendererTestResultWriter) {
        this.testResultWriter = testResultWriter;
    }

}
