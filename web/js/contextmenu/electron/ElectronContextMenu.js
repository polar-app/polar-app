const electron = require('electron');
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const {ContextMenuType} = require("../ContextMenuType");
const {DialogWindow} = require("./DialogWindow");
const {ContextMenu} = require("../ContextMenu");
const {Preconditions} = require("../../Preconditions");

const WEBSERVER_PORT = 8500;
const DEFAULT_HOST = "127.0.0.1";

/**
 * Careful here as this is confusing.  We're using the REMOVE interface so the
 * context changes. This code is triggered from the renderer but then runs
 * in the main process.
 */
class ElectronContextMenu extends ContextMenu {

    constructor() {
        super();

        ipcMain.on('context-menu-trigger', function(event, arg) {
            console.log("FIXME: we have been triggered: ", event); // prints "ping"

            this.trigger(arg.point, arg.contextMenuTypes, event.sender);

        }.bind(this));

    }

    trigger(point, contextMenuTypes, sender) {

        Preconditions.assertNotNull(sender, "sender");

        let window = BrowserWindow.getFocusedWindow();

        console.log("GOT IT for: " + contextMenuTypes)

        const ctxMenu = this.createTextHighlightContextMenu(point, contextMenuTypes, sender);

        ctxMenu.popup(window, point.x, point.y);

    }

    cmdAddFlashcard(sender) {

        Preconditions.assertNotNull(sender, "sender");

        sender.send('context-menu-create-flashcard', {
            command: "add-flashcard"
        });

        let url = `http://${DEFAULT_HOST}:${WEBSERVER_PORT}/card-creator/index.html`;

        DialogWindow.create({url});

        // // FIXME: it would be BETTER to send an event to the renderer to trigger this..
        //
        // let innerHTML = `<div id="add-flashcard" class="polar-lightbox">
        //
        //     <iframe src="/card-creator/index.html"></iframe>
        //
        // </div>
        // `;
        //
        // let lightbox = Elements.createElementHTML(innerHTML);
        //
        // Modal.create(lightbox);

    }

    createTextHighlightContextMenu(point, contextMenuTypes, sender) {

        Preconditions.assertNotNull(sender, "sender");

        const ctxMenu = new Menu();

        let window = BrowserWindow.getFocusedWindow();

        // TODO: move this to a template as the code is cleaner

        if(contextMenuTypes.includes(ContextMenuType.TEXT_HIGHLIGHT)) {

            ctxMenu.append(new MenuItem( {
                label: 'Add Flashcard',
                accelerator: 'CmdOrCtrl+A',
                click: function () {
                    this.cmdAddFlashcard(sender);
                }.bind(this)}));

        }

        ctxMenu.append(new MenuItem( {
            label: 'Inspect Element',
            id: "inspect",
            //accelerator: 'CmdOrCtrl+A',
            click: function (event) {

                // the points are SLIGHTLY off for the iframe version which is
                // very annoying.
                window.inspectElement(point.x, point.y);

                if (window.webContents.isDevToolsOpened()) {
                    window.webContents.devToolsWebContents.focus();
                }

            }.bind(this)}));

        // ctxMenu.append(new MenuItem({ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' }))
        // ctxMenu.append(new MenuItem({ label: 'Inspect Element', accelerator: 'Ctrl+Shift+I', click: function () {
        //         window.inspectElement(screenX, screenY)
        //     } }));

        return ctxMenu;

    }

};

module.exports.ElectronContextMenu = ElectronContextMenu;
