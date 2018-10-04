import {MainAppController} from './MainAppController';
import {BrowserWindow, dialog, Menu, shell} from "electron";
import {ElectronContextMenu} from '../../contextmenu/electron/ElectronContextMenu';
import {Version} from '../../util/Version';
import {AppLauncher} from './AppLauncher';
import {Logger} from '../../logger/Logger';
import {Promises} from '../../util/Promises';
import {InPageSearch} from './InPageSearch';
import MenuItem = Electron.MenuItem;
import {ManualUpdates} from '../../updates/ManualUpdates';
import {Platform, Platforms} from '../../util/Platforms';

const log = Logger.create();

export class MainAppMenu {

    private readonly mainAppController: MainAppController;
    private mode: MainMenuMode;

    constructor(mainAppController: MainAppController,
                mode: MainMenuMode = MainMenuMode.DOC_REPO_APP) {

        this.mainAppController = mainAppController;
        this.mode = mode;

    }

    public setup(): void {

        const menu = Menu.buildFromTemplate(this.createMenuTemplate());

        Menu.setApplicationMenu(menu);

        // start the context menu system.
        new ElectronContextMenu();

    }

    private createMenuTemplate(): any {
        return [
            this.createFileMenuTemplate(),
            this.createEditMenuTemplate(),
            // this.createAnnotateMenuTemplate(),
            this.createViewMenuTemplate(),
            {
                label: 'Window',
                role: 'window',
                submenu: [
                    { label: 'Minimize', role: 'minimize' },
                    { label: 'Close', role: 'close' },
                ]
            },
            {
                label: 'Tools',
                submenu: [
                    {
                        label: 'Document Repository',
                        click: () => Promises.executeLogged(AppLauncher.launchRepositoryApp)
                    },
                    {
                        label: 'Toggle Developer Tools',
                        click: this.mainAppController.cmdToggleDevTools
                    },

                ]
            },
            {
                id: 'help',
                label: 'Help',
                role: 'help',
                submenu: [{
                    label: 'About',
                    click: (item: Electron.MenuItem, focusedWindow: BrowserWindow) => {
                            dialog.showMessageBox(focusedWindow, {
                                type: 'info',
                                buttons: ['OK'],
                                title: 'Polar Bookshelf',
                                message: 'Version ' + Version.get(),
                                detail: '',
                                // icon: APP_ICON
                            });
                        }
                    },
                    {
                        id: 'check-for-updates',
                        label: 'Check for updates',
                        // only show on Windows and MacOS as all other platforms have
                        // their own dist system (for now).
                        visible: Platforms.get() === Platform.MACOS || Platform.WINDOWS,
                        click: ManualUpdates.checkForUpdates
                    },
                    { label: 'Discord',
                      click: () => shell.openExternal('https://discord.gg/GT8MhA6') },

                    { label: 'Reddit',
                      click: () => shell.openExternal('https://www.reddit.com/r/PolarBookshelf/') },

                    { label: 'Learn More',
                      click: () => shell.openExternal('https://github.com/burtonator/polar-bookshelf') },

                ]
            },
        ];

    }

    private createFileMenuTemplate() {

        return {
            label: 'File',
            submenu: [

                // {
                //     label: 'New Window',
                //     accelerator: 'CmdOrCtrl+N',
                //     click: this.mainAppController.cmdNewWindow.bind(this.mainAppController)
                // },
                // {
                //     type: 'separator'
                // },

                // {
                //     label: 'Open',
                //     accelerator: 'CmdOrCtrl+O',
                //     click: this.mainAppController.cmdOpen.bind(this.mainAppController)
                // },
                {
                    label: 'Open',
                    accelerator: 'CmdOrCtrl+O',
                    click: this.mainAppController.cmdOpenInNewWindow.bind(this.mainAppController)
                },
                // {
                //     label: 'Capture Web Page',
                //     // accelerator: 'CmdOrCtrl+O',
                //     click: () => {
                //         this.mainAppController.cmdCaptureWebPage()
                //             .catch((err: Error) => log.error("Could not capture page: ", err));
                //     }
                // },
                {
                    label: 'Capture Web Page',
                    // accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        this.mainAppController.cmdCaptureWebPageWithBrowser()
                            .catch((err: Error) => log.error("Could not capture page: ", err));
                    }

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
                    click: (item: Electron.MenuItem, focusedWindow: BrowserWindow) => {
                        if (focusedWindow) focusedWindow.webContents.print();
                    }
                },
                {
                    label: 'Close',
                    role: 'close',
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: this.mainAppController.cmdExit.bind(this.mainAppController)
                },
            ]
        };

    }


    private createEditMenuTemplate() {
        return {
            id: 'edit',
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                // { type: 'separator' },
                // { label: 'Find', accelerator: 'CmdOrCtrl+f', click: () => InPageSearch.execute() },
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
        };
    }

    private createAnnotateMenuTemplate() {

        // TODO: create pagemark
        //       Mark current page read
        //       Create new pagemark
        //

        return {
            id: 'annotate',
           label: 'Annotate',
            enabled: false,
            visible: false,
            submenu: [
                { role: 'undo', enabled: false },
                { role: 'redo' },
                // { type: 'separator' },
                // { label: 'Find', accelerator: 'CmdOrCtrl+f', click: () => InPageSearch.execute() },
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
        };
    }


    private createViewMenuTemplate() {
        return {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: (item: Electron.MenuItem, focusedWindow: BrowserWindow) => {
                        if (focusedWindow) {
                            focusedWindow.webContents.reloadIgnoringCache();
                        }
                    }
                },
                // {
                //     label: 'Annotations Sidebar',
                //     type: 'checkbox',
                //     click: (item: Electron.MenuItem, focusedWindow: BrowserWindow) => {
                //         if (focusedWindow) {
                //             focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                //         }
                //     }
                // },
                {
                    label: 'Toggle Full Screen',
                    accelerator: (function() {
                        if (process.platform === 'darwin') {
                            return 'Ctrl+Command+F';
                        } else {
                            return 'F11';
                        }
                    })(),
                    click: (item: Electron.MenuItem, focusedWindow: BrowserWindow) => {
                        if (focusedWindow) {
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                        }
                    }
                },
            ]
        };
    }
}


// TODO: this is a short term work around to enable selected options from JUST
// the editor window.
export enum MainMenuMode {
    DOC_REPO_APP,
    VIEWER_APP
}
