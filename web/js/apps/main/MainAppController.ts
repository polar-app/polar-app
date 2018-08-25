import {app, shell, dialog, BrowserWindow, nativeImage} from 'electron';
import MenuItem = Electron.MenuItem;
import {AppPaths} from '../../electron/webresource/AppPaths';
import {Logger} from '../../logger/Logger';
import {Services} from '../../util/services/Services';
import {FileLoader} from './loaders/FileLoader';
import {Datastore} from '../../datastore/Datastore';
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import {Webserver} from '../../backend/webserver/Webserver';
import {ProxyServer} from '../../backend/proxyserver/ProxyServer';

const fspath = require('path');
const process = require('process');

const log = Logger.create();

const app_icon = nativeImage.createFromPath(fspath.join(process.cwd(), 'icon.png'));

const WIDTH = 800 * 1.2;
const HEIGHT = 1100 * 1.2;

// TODO: use AppPaths for this.
const DEFAULT_URL = `file://${__dirname}/apps/home/default.html`;

const BROWSER_WINDOW_OPTIONS: BrowserWindowConstructorOptions = {
    backgroundColor: '#FFF',
    minWidth: WIDTH * 0.4,
    minHeight: HEIGHT * 0.4,
    width: WIDTH,
    height: HEIGHT,
    show: false,
    // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
    icon: app_icon,
    webPreferences: {
        // TODO:
        // https://github.com/electron/electron/pull/794
        //
        // reconsider using nodeIntegration here as this might be a security
        // issue
        nodeIntegration: true,
        defaultEncoding: 'UTF-8',

        // We are disabling web security now as a work around for CORS issues
        // when loading fonts.  Once we resolve this we can enable webSecurity
        // again.
        webSecurity: false,
        webaudio: false,

        /**
         * Use a persistent cookie session between restarts.  This is used so
         * that we keep user cookies including Google Analytics cookies.
         */
        //partition: "persist:polar"

    }
};

export class MainAppController {

    private readonly fileLoader: FileLoader;

    private readonly datastore: Datastore;

    private readonly webserver: Webserver;

    private readonly proxyServer: ProxyServer;

    constructor(fileLoader: FileLoader, datastore: Datastore, webserver: Webserver, proxyServer: ProxyServer) {
        this.fileLoader = fileLoader;
        this.datastore = datastore;
        this.webserver = webserver;
        this.proxyServer = proxyServer;
    }

    public async cmdCaptureWebPage(item: MenuItem, focusedWindow: BrowserWindow) {

        let browserWindowOptions = Object.assign({}, BROWSER_WINDOW_OPTIONS);

        browserWindowOptions.width = browserWindowOptions.width! * .9;
        browserWindowOptions.height = browserWindowOptions.height! * .9;
        browserWindowOptions.center = true;

        let url = AppPaths.resource('./apps/capture/start-capture/index.html')

        await this.createWindow(browserWindowOptions, url);

        // TODO: move to AppPaths here... loadFile does not work reliably.


    }

    /**
     * Load a PDF file when given a full URL.  May be file, http, or https URL.
     */
    public async cmdOpen(item: MenuItem, focusedWindow: BrowserWindow) {

        let targetWindow = focusedWindow;

        let path = await this.promptDoc();

        await this.loadDoc(path, targetWindow);

    }

    public async cmdNewWindow(item: MenuItem, focusedWindow: BrowserWindow) {
        await this.createWindow();
    }

    public async cmdOpenInNewWindow(item: MenuItem, focusedWindow: BrowserWindow) {

        let path = await this.promptDoc();

        let targetWindow = await this.createWindow(BROWSER_WINDOW_OPTIONS, "about:blank");

        await this.loadDoc(path, targetWindow);

    }

    public cmdExit() {
        this.exitApp();
    }

    public cmdToggleDevTools(item: MenuItem, focusedWindow: BrowserWindow) {
        log.info("Toggling dev tools in: " + focusedWindow);
        focusedWindow.webContents.toggleDevTools();
    }


    private exitApp() {

        log.info("Exiting app...");

        Services.stop({
            webserver: this.webserver,
            proxyServer: this.proxyServer
        });

        log.info("Exiting electron...");

        app.quit();

        log.info("Exiting main...");
        process.exit();

    }


    /**
     * Load the given PDF file in the given target window.
     */
    public async loadDoc(path: string, targetWindow: BrowserWindow) {

        if(!targetWindow) {
            throw new Error("No target window given");
        }

        let loadedFile = await this.fileLoader.registerForLoad(path);

        log.info("Loading webapp at: " + loadedFile.webResource);

        loadedFile.webResource.load(targetWindow);

        // TODO: now that we know the app name, call
        // targetWindow.webContents.getUserAgent() to get the UA I think...

        // TODO: we can actually do this withh init.. since we start a browser
        // window almost immediately

        targetWindow.webContents.once('did-finish-load', function() {

            if(loadedFile.title) {
                // TODO: this should be driven from the DocMeta and the DocMeta
                // should be initialized from the descriptor.
                targetWindow.setTitle(loadedFile.title);
            }

        });

    }


    /**
     * Open a dialog box for a PDF file.
     */
    private async promptDoc(): Promise<string> {

        return new Promise<string>((resolve) => {

            dialog.showOpenDialog({
                  title: "Open Document",
                  defaultPath: this.datastore.stashDir,
                  filters: [
                      { name: 'Docs', extensions: ['pdf', "phz"] }
                  ],
                  properties: ['openFile']
              }, (path) => {

                if (path) {
                    resolve(path[0]);
                }

            });

        });

    }

    private createWindow(browserWindowOptions: BrowserWindowConstructorOptions = BROWSER_WINDOW_OPTIONS, url=DEFAULT_URL): Promise<BrowserWindow> {

        log.info("Creating window for URL: ", url);

        // Create the browser window.
        let newWindow = new BrowserWindow(browserWindowOptions);

        newWindow.on('close', function(e) {
            e.preventDefault();
            newWindow.webContents.clearHistory();
            newWindow.webContents.session.clearCache(function() {
                newWindow.destroy();
            });
        });

        newWindow.on('closed', () => {

            if(BrowserWindow.getAllWindows().length === 0) {
                // determine if we need to quit:
                log.info("No windows left. Quitting app.");

                this.exitApp();

            }

        });

        newWindow.webContents.on('new-window', (e, url) => {
            e.preventDefault();
            shell.openExternal(url);
        });

        // TODO: we need SANE handling of dev tools.  Having it forced on us isn't fun.
        // newWindow.webContents.on('devtools-opened', function(e) {
        //    e.preventDefault();
        //    this.closeDevTools();
        // });

        newWindow.webContents.on('will-navigate', (e, url) => {
            log.info("Attempt to navigate to new URL: ", url);
            // required to force the URLs clicked to open in a new browser.  The
            // user probably / certainly wants to use their main browser.
            e.preventDefault();
            shell.openExternal(url);
        });

        log.info("Loading URL: ", url);
        newWindow.loadURL(url);

        return new Promise<BrowserWindow>(resolve => {

            newWindow.once('ready-to-show', () => {

                newWindow.show();

                resolve(newWindow);

            });

        })

    }

    public createMenuTemplate(): any {
        return     //creating menus for menu bar
        const MENU_TEMPLATE = [{
            label: 'File',
            submenu: [

                {
                    label: 'New Window',
                    accelerator: 'CmdOrCtrl+N',
                    click: this.cmdNewWindow
                },
                {
                    type: 'separator'
                },

                {
                    label: 'Open',
                    accelerator: 'CmdOrCtrl+O',
                    click: this.cmdOpen
                },
                {
                    label: 'Open in New Window',
                    //accelerator: 'CmdOrCtrl+O',
                    click: this.cmdOpenInNewWindow
                },
                {
                    label: 'Capture Web Page',
                    //accelerator: 'CmdOrCtrl+O',
                    click: this.cmdCaptureWebPage
                },

                // {
                //     label: 'Open Containing Folder',
                //     accelerator: 'CmdOrCtrl+F',
                //     click: function(item, focusedWindow) {
                //         if (focusedWindow && filepath)
                //             shell.showItemInFolder("file:///" + filepath);
                //     }
                // },

                {
                    type: 'separator'
                },

                {
                    label: 'Print',
                    accelerator: 'CmdOrCtrl+P',
                    click: function(item: MenuItem, focusedWindow: BrowserWindow) {
                        if (focusedWindow) focusedWindow.webContents.print();
                    }
                },
                {
                    label: 'Close',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    click: function(item: MenuItem, focusedWindow: BrowserWindow) {
                        if (focusedWindow) focusedWindow.close();
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Exit',
                    accelerator: 'Alt+F4',
                    click: this.cmdExit
                },
            ]
        },
            {
                label: 'Edit',
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    // { type: 'separator' },
                    // { label: 'Find', accelerator: 'CmdOrCtrl+f', click: cmdFind },
                    { type: 'separator' },
                    { role: 'cut'},
                    { role: 'copy' },
                    { role: 'paste' },
                    { role: 'pasteandmatchstyle' },
                    { role: 'selectall' },
                    { type: 'separator' },
                    // {
                    //     label: 'Change Pagemark Column Type',
                    //     submenu: [
                    //         { label: 'Single', },
                    //         { label: 'Double', },
                    //         { label: 'Triple', },
                    //     ]
                    // },
                ]
            },
            {
                label: 'View',
                submenu: [{
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: function(item: MenuItem, focusedWindow: BrowserWindow) {
                        if (focusedWindow)
                            focusedWindow.webContents.reloadIgnoringCache();
                    }
                },
                    {
                        label: 'Toggle Full Screen',
                        accelerator: (function() {
                            if (process.platform === 'darwin')
                                return 'Ctrl+Command+F';
                            else
                                return 'F11';
                        })(),
                        click: function(item: MenuItem, focusedWindow: BrowserWindow) {
                            if (focusedWindow)
                                focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                        }
                    },
                ]
            },
            {
                label: 'Window',
                role: 'window',
                submenu: [
                    { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
                    { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
                ]
            },
            {
                label: 'Tools',
                submenu: [
                    { label: 'Toggle Developer Tools', click: this.cmdToggleDevTools },
                ]
            },
            {
                label: 'Help',
                role: 'help',
                submenu: [{
                    label: 'About',
                    click: function(item: MenuItem, focusedWindow: BrowserWindow) {
                        dialog.showMessageBox(focusedWindow, {
                            type: 'info',
                            buttons: ['OK'],
                            title: 'Polar Bookshelf',
                            message: 'Version 1.0',
                            detail: '',
                            icon: app_icon
                        });
                    }
                },
                    { label: 'Discord', click: function() { shell.openExternal('https://discord.gg/GT8MhA6'); } },
                    { label: 'Reddit', click: function() { shell.openExternal('https://www.reddit.com/r/PolarBookshelf/'); } },
                    { label: 'Learn More', click: function() { shell.openExternal('https://github.com/burtonator/polar-bookshelf'); } },
                ]
            },
        ];

    }

}
