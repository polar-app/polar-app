"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainMenuMode = exports.MainAppMenu = void 0;
const electron_1 = require("electron");
const Version_1 = require("polar-shared/src/util/Version");
const AppLauncher_1 = require("./AppLauncher");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Promises_1 = require("../../util/Promises");
const Updates_1 = require("../../updates/Updates");
const Platforms_1 = require("polar-shared/src/util/Platforms");
const BrowserWindowRegistry_1 = require("../../electron/framework/BrowserWindowRegistry");
const Menus_1 = require("./Menus");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Directories_1 = require("../../datastore/Directories");
const Messenger_1 = require("../../electron/messenger/Messenger");
const AppUpdates_1 = require("../../updates/AppUpdates");
const log = Logger_1.Logger.create();
const WINDOW_TYPE = 'type';
class MainAppMenu {
    constructor(mainAppController, mode = MainMenuMode.DOC_REPO_APP) {
        this.mainAppController = mainAppController;
        this.mode = mode;
    }
    setup() {
        const menu = electron_1.Menu.buildFromTemplate(this.createMenuTemplate());
        electron_1.Menu.setApplicationMenu(menu);
        this.registerEventListeners();
    }
    registerEventListeners() {
        electron_1.app.on('browser-window-focus', (event, browserWindow) => {
            const meta = BrowserWindowRegistry_1.BrowserWindowRegistry.get(browserWindow.id);
            const isViewer = Preconditions_1.isPresent(meta) &&
                meta.tags &&
                meta.tags[WINDOW_TYPE] === 'viewer';
            const menu = electron_1.Menu.getApplicationMenu();
            function handleSyncFlashcardsToAnki() {
                const toolsMenu = Menus_1.Menus.find(menu.items, 'tools');
                const toolsMenuItems = Menus_1.Menus.submenu(toolsMenu);
                const syncFlashcardsToAnkiMenuItem = Menus_1.Menus.find(toolsMenuItems, 'sync-flashcards-to-anki');
                Menus_1.Menus.setVisible(syncFlashcardsToAnkiMenuItem, !isViewer);
            }
            handleSyncFlashcardsToAnki();
            const annotateMenu = Menus_1.Menus.find(menu.items, 'annotate');
            if (annotateMenu) {
                const annotateMenuItems = Menus_1.Menus.submenu(annotateMenu);
                annotateMenuItems.forEach(current => {
                    Menus_1.Menus.setEnabled(current, isViewer);
                });
            }
        });
    }
    createMenuTemplate() {
        const menuTemplate = [
            this.createFileMenuTemplate(),
            this.createEditMenuTemplate(),
            this.createViewMenuTemplate(),
            this.createToolsMenuTemplate(),
            this.createWindowMenuTemplate(),
            this.createHelpMenuTemplate()
        ];
        if (Platforms_1.Platforms.get() === Platforms_1.Platform.MACOS) {
            menuTemplate.unshift(this.createMacOSMenuTemplate());
        }
        return menuTemplate.filter(current => current !== undefined);
    }
    createAboutMessage() {
        const dataDir = Directories_1.Directories.getDataDir().path;
        const version = Version_1.Version.get();
        return '' +
            `version:  ${version}\n` +
            `data dir: ${dataDir}\n`;
    }
    createAppMenuTemplate() {
        return {
            label: 'Polar',
            id: 'polar',
            platform: 'darwin',
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        };
    }
    createMacOSMenuTemplate() {
        return {
            label: 'Polar',
            submenu: [
                {
                    label: 'About Polar',
                    click: () => this.showHelpAboutDialog()
                },
                {
                    type: 'separator'
                },
                { role: 'hide', label: 'Hide Polar' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => this.mainAppController.cmdExit()
                },
            ]
        };
    }
    createFileMenuTemplate() {
        const isMacOS = Platforms_1.Platforms.get() === Platforms_1.Platform.MACOS;
        if (isMacOS) {
            return undefined;
        }
        return {
            label: 'File',
            submenu: [
                {
                    role: 'quit',
                    label: 'Quit',
                    visible: !isMacOS,
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => this.mainAppController.cmdExit()
                },
            ]
        };
    }
    createEditMenuTemplate() {
        return {
            id: 'edit',
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteandmatchstyle' },
                { role: 'selectall' },
                { type: 'separator' },
            ]
        };
    }
    createAnnotateMenuTemplate() {
        return {
            id: 'annotate',
            label: 'Annotate',
            enabled: false,
            visible: false,
            submenu: [
                { role: 'undo', enabled: false, visible: 'false' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteandmatchstyle' },
                { role: 'selectall' },
                { type: 'separator' },
            ]
        };
    }
    createViewMenuTemplate() {
        return {
            id: 'view',
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: (item, focusedWindow) => {
                        if (focusedWindow) {
                            focusedWindow.webContents.reloadIgnoringCache();
                        }
                    }
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: (function () {
                        if (process.platform === 'darwin') {
                            return 'Ctrl+Command+F';
                        }
                        else {
                            return 'F11';
                        }
                    })(),
                    click: (item, focusedWindow) => {
                        if (focusedWindow) {
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                        }
                    }
                },
            ]
        };
    }
    createWindowMenuTemplate() {
        return {
            label: 'Window',
            role: 'window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' },
            ]
        };
    }
    createToolsMenuTemplate() {
        return {
            id: 'tools',
            label: 'Tools',
            submenu: [
                {
                    label: 'Document Repository',
                    click: () => Promises_1.Promises.executeLogged(AppLauncher_1.AppLauncher.launchRepositoryApp)
                },
                {
                    id: 'sync-flashcards-to-anki',
                    label: 'Sync Flashcards to Anki',
                    click: () => {
                        Messenger_1.Messenger.postMessage({
                            message: {
                                type: "start-anki-sync"
                            }
                        }).catch(err => log.error("Could not post message", err));
                    }
                },
                { type: 'separator' },
                {
                    label: 'Toggle Developer Tools',
                    click: this.mainAppController.cmdToggleDevTools
                },
            ]
        };
    }
    createHelpMenuTemplate() {
        return {
            id: 'help',
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'About',
                    click: () => this.showHelpAboutDialog()
                },
                { label: 'Documentation',
                    click: () => electron_1.shell.openExternal('https://getpolarized.io/docs/') },
                {
                    id: 'check-for-updates',
                    label: 'Check for Updates',
                    visible: AppUpdates_1.AppUpdates.platformSupportsUpdates(),
                    click: (item) => Updates_1.Updates.checkForUpdates(item),
                },
                { type: 'separator' },
                { label: 'Donate',
                    click: () => electron_1.shell.openExternal('https://opencollective.com/polar-bookshelf/donate') },
                { type: 'separator' },
                { label: 'Discord',
                    click: () => electron_1.shell.openExternal('https://discord.gg/GT8MhA6') },
                { label: 'Reddit',
                    click: () => electron_1.shell.openExternal('https://www.reddit.com/r/PolarBookshelf/') },
                { label: 'Learn More',
                    click: () => electron_1.shell.openExternal('https://github.com/burtonator/polar-bookshelf') },
                { type: 'separator' },
                { label: 'Cookie Policy',
                    click: () => electron_1.shell.openExternal('https://getpolarized.io/cookie-policy.html') },
                { label: 'Terms of Service',
                    click: () => electron_1.shell.openExternal('https://getpolarized.io/terms-of-service.html') },
                { label: 'Privacy Policy',
                    click: () => electron_1.shell.openExternal('https://getpolarized.io/privacy-policy.html') },
            ]
        };
    }
    showHelpAboutDialog() {
        electron_1.dialog.showMessageBox(electron_1.BrowserWindow.getFocusedWindow(), {
            type: 'info',
            buttons: ['OK'],
            title: 'Polar',
            message: this.createAboutMessage(),
            detail: '',
        }).catch(err => log.error("Unable to show dialog: ", err));
    }
}
exports.MainAppMenu = MainAppMenu;
var MainMenuMode;
(function (MainMenuMode) {
    MainMenuMode[MainMenuMode["DOC_REPO_APP"] = 0] = "DOC_REPO_APP";
    MainMenuMode[MainMenuMode["VIEWER_APP"] = 1] = "VIEWER_APP";
})(MainMenuMode = exports.MainMenuMode || (exports.MainMenuMode = {}));
//# sourceMappingURL=MainAppMenu.js.map