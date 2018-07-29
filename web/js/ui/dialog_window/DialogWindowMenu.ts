import {BrowserWindow, MenuItem, Menu} from 'electron';
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

export class DialogWindowMenu {

    static cmdToggleDevTools(item: MenuItem, window: BrowserWindow) {
        console.log("Toggling dev tools in: ", window);
        window.webContents.toggleDevTools();
    }

    static create(): Menu {

        const MENU_TEMPLATE: MenuItemConstructorOptions[] = [
            {
                label: 'Edit',
                submenu: [
                    { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                    { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
                    { type: 'separator' },
                    { label: "Cut", accelerator: "CmdOrCtrl+X",},
                    { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: "copy:" },
                    { label: "Paste", accelerator: "CmdOrCtrl+V"},
                    { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' },
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
                    { label: 'Toggle Developer Tools', click: DialogWindowMenu.cmdToggleDevTools },
                ]
            }
        ];

        return Menu.buildFromTemplate(MENU_TEMPLATE);

    }

}
