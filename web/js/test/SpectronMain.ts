import {app, BrowserWindow} from 'electron';
import {TestResultWriter} from './results/TestResultWriter';
import {MainTestResultWriter} from './results/writer/MainTestResultWriter';
import Spec = Mocha.reporters.Spec;

const BROWSER_OPTIONS = {
    backgroundColor: '#FFF',

    // NOTE: the default width and height shouldn't be changed here as it can
    // break unit tests.

    //width: 1000,
    //height: 1000,

    webPreferences: {
        webSecurity: false,
    }
};

/**
 * Code for reliably working with the main process in Spectron.
 */
export class SpectronMain {

    /**
     */
    static setup(): Promise<Electron.BrowserWindow> {

        return new Promise(resolve => {

            console.log("Electron app started. Waiting for it to be ready.");

            app.on('ready', async function() {

                console.log("Ready!  Creating main window!!");

                let mainWindow = new BrowserWindow(BROWSER_OPTIONS);
                mainWindow.loadURL('about:blank');
                resolve(mainWindow);

            });

        })

    }

    static async start(callback: StateCallback) {
        let window = await SpectronMain.setup();
        let testResultWriter = new MainTestResultWriter(window);

        callback(new SpectronMainState(window, testResultWriter));

    }

    /**
     * Like start but not async and assume this is the entry point of your test
     * and just print error messages to the console.
     **/
    static run(callback: StateCallback) {
        SpectronMain.start(callback).catch(err => console.log(err));
    }


}

export class SpectronMainState {

    public readonly window: BrowserWindow;

    public readonly testResultWriter: MainTestResultWriter;


    constructor(window: Electron.BrowserWindow, testResultWriter: MainTestResultWriter) {
        this.window = window;
        this.testResultWriter = testResultWriter;
    }

}

export interface StateCallback {
    (state: SpectronMainState): void
}
