import {app, BrowserWindow} from 'electron';
import {MainTestResultWriter} from './results/writer/MainTestResultWriter';

export const BROWSER_OPTIONS = {
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

    static createWindow() {

    }

    static setup(options?: SpectronMainOptions): Promise<Electron.BrowserWindow> {

        return new Promise(resolve => {

            console.log("Electron app started. Waiting for it to be ready.");

            app.on('ready', async function() {

                console.log("Ready!  Creating main window!!");

                let windowFactory: WindowFactory = async () => {
                    let mainWindow = new BrowserWindow(BROWSER_OPTIONS);
                    //mainWindow.webContents.toggleDevTools();
                    mainWindow.loadURL('about:blank');
                    return mainWindow;
                };

                if(options && options.windowFactory) {
                    windowFactory = options.windowFactory;
                }

                let mainWindow = await windowFactory();

                console.log("Done.. resolving");
                resolve(mainWindow);

            });

        })

    }

    static async start(callback: StateCallback, options?: SpectronMainOptions): Promise<void> {
        let window = await SpectronMain.setup(options);
        let testResultWriter = new MainTestResultWriter(window);

        return callback(new SpectronMainState(window, testResultWriter));

    }

    /**
     * Like start but not async and assume this is the entry point of your test
     * and just print error messages to the console.
     **/
    static run(callback: StateCallback, options?: SpectronMainOptions) {
        SpectronMain.start(callback, options).catch(err => console.log(err));
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

export interface SpectronMainOptions {

    readonly windowFactory?: WindowFactory;

}

export interface StateCallback {
    (state: SpectronMainState): Promise<void>
}

export interface WindowFactory {
    (): Promise<BrowserWindow>;
}

