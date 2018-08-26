import {MainAppController} from './MainAppController';
import {BrowserWindow, dialog, Menu, shell} from "electron";
import {APP_ICON} from './MainBrowserWindowFactory';
import {ElectronContextMenu} from '../../contextmenu/electron/ElectronContextMenu';

export class MainAppMenu {

    private readonly mainAppController: MainAppController;

    constructor(mainAppController: MainAppController) {
        this.mainAppController = mainAppController;
    }

    public setup(): void {

        let menu = Menu.buildFromTemplate(this.createMenuTemplate());

        Menu.setApplicationMenu(menu);

        // start the context menu system.
        new ElectronContextMenu();

    }

    private createMenuTemplate(): any {
        return [{
            label: 'File',
            submenu: [

                {
                    label: 'New Window',
                    accelerator: 'CmdOrCtrl+N',
                    click: this.mainAppController.cmdNewWindow.bind(this.mainAppController)
                },
                {
                    type: 'separator'
                },

                {
                    label: 'Open',
                    accelerator: 'CmdOrCtrl+O',
                    click: this.mainAppController.cmdOpen.bind(this.mainAppController)
                },
                {
                    label: 'Open in New Window',
                    //accelerator: 'CmdOrCtrl+O',
                    click: this.mainAppController.cmdOpenInNewWindow.bind(this.mainAppController)
                },
                {
                    label: 'Capture Web Page',
                    //accelerator: 'CmdOrCtrl+O',
                    click: this.mainAppController.cmdCaptureWebPage.bind(this.mainAppController)
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
                    click: function(item: Electron.MenuItem, focusedWindow: BrowserWindow) {
                        if (focusedWindow) focusedWindow.webContents.print();
                    }
                },
                {
                    label: 'Close',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    click: function(item: Electron.MenuItem, focusedWindow: BrowserWindow) {
                        if (focusedWindow) focusedWindow.close();
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Exit',
                    accelerator: 'Alt+F4',
                    click: this.mainAppController.cmdExit.bind(this.mainAppController)
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
                    click: function(item: Electron.MenuItem, focusedWindow: BrowserWindow) {
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
                        click: function(item: Electron.MenuItem, focusedWindow: BrowserWindow) {
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
                    { label: 'Toggle Developer Tools', click: this.mainAppController.cmdToggleDevTools },
                ]
            },
            {
                label: 'Help',
                role: 'help',
                submenu: [{
                    label: 'About',
                    click: function(item: Electron.MenuItem, focusedWindow: BrowserWindow) {
                        dialog.showMessageBox(focusedWindow, {
                            type: 'info',
                            buttons: ['OK'],
                            title: 'Polar Bookshelf',
                            message: 'Version 1.0',
                            detail: '',
                            //icon: APP_ICON
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

