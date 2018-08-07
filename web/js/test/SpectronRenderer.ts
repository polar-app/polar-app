
import {ipcRenderer} from 'electron';
import {TestResultService} from './results/TestResultService';
import {RendererTestResultWriter} from './results/writer/RendererTestResultWriter';

export class SpectronRenderer {

    static setup() {
        new TestResultService().start();
    }

    static async start(callback: RunCallback): Promise<any> {
        SpectronRenderer.setup();
        let state = new SpectronRendererState();

        let result = await callback(state);

        ipcRenderer.send('spectron-renderer-started', true);

        return result;

    }

    static run(callback: RunCallback) {
        this.start(callback)
            .catch(err => console.error(err));
    }

}

export interface RunCallback {
    (state: SpectronRendererState): Promise<any>
}


export class SpectronRendererState {

    get testResultWriter() {
        return new RendererTestResultWriter();
    }

}
