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
                role: 'edit',
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    { type: 'separator' },
                    { role: 'cut'},
                    { role: 'copy' },
                    { role: 'paste'},
                    { role: 'pasteandmatchstyle' },
                    { role: 'selectall' },
                ]
            },
            {
                label: 'View',
                role: 'view',
                submenu: [
                    { role: 'reload' },
                    { role: 'togglefullscreen' },
                ]
            },
            {
                label: 'Window',
                role: 'window',
                submenu: [
                    { role: 'minimize' },
                    { role: 'close' },
                ]
            },
            {
                label: 'Tools',
                submenu: [
                    { role: 'toggledevtools' },
                ]
            }
        ];

        return Menu.buildFromTemplate(MENU_TEMPLATE);

    }

}
