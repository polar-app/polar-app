import {app, BrowserWindow} from 'electron';
import {MainTestResultWriter} from './results/writer/MainTestResultWriter';

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
export class SpectronMain2 {

    private readonly options: Readonly<SpectronMainOptions>;

    private constructor(options: Readonly<SpectronMainOptions>) {
        this.options = options;
    }

    /**
     * Create a window using the current window constructor function.
     */
    async createWindow(): Promise<BrowserWindow> {
        return await this.options.windowFactory();
    }

    setup(): Promise<BrowserWindow> {

        return new Promise(resolve => {

            console.log("Electron app started. Waiting for it to be ready.");

            app.on('ready', async () => {

                console.log("Ready!  Creating main window!!");

                let mainWindow = await this.options.windowFactory();

                console.log("Done.. resolving");
                resolve(mainWindow);

            });

        })

    }

    async start(callback: StateCallback): Promise<void> {
        let window = await this.setup();
        let testResultWriter = new MainTestResultWriter(window);

        return callback(new SpectronMainState(this, window, testResultWriter));

    }

    /**
     * Like start but not async and assume this is the entry point of your test
     * and just print error messages to the console.
     **/
    run(callback: StateCallback) {
        this.start(callback).catch(err => console.log(err));
    }

    static create(options: SpectronMainOptions = new SpectronMainOptions().build()) {
        return new SpectronMain2(options);
    }

}

async function defaultWindowFactory(): Promise<BrowserWindow> {
    let mainWindow = new BrowserWindow(BROWSER_OPTIONS);
    //mainWindow.webContents.toggleDevTools();
    mainWindow.loadURL('about:blank');
    return mainWindow;
}

export class SpectronMainState {

    public readonly spectronMain: SpectronMain2;

    public readonly window: BrowserWindow;

    public readonly testResultWriter: MainTestResultWriter;

    constructor(spectronMain: SpectronMain2, window: BrowserWindow, testResultWriter: MainTestResultWriter) {
        this.spectronMain = spectronMain;
        this.window = window;
        this.testResultWriter = testResultWriter;
    }

    /**
     * Create a window with the same WindowFactory that SpectronMain is using.
     */
    async createWindow() {
        return this.spectronMain.createWindow();
    }

}

export class SpectronMainOptions {

    public windowFactory: WindowFactory = defaultWindowFactory;

    /**
     * True to automatically start dev tools on each window when using the
     * default window factory.
     */
    public enableDevTools = false;

    build(): Readonly<SpectronMainOptions> {
        return Object.freeze(this);
    }

}

export interface StateCallback {
    (state: SpectronMainState): Promise<void>
}

export interface WindowFactory {
    (): Promise<BrowserWindow>;
}
