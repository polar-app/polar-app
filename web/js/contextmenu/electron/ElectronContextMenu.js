const electron = require('electron');
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const {ContextMenuType} = require("../ContextMenuType");
const {DialogWindow} = require("./DialogWindow");
const {ContextMenu} = require("../ContextMenu");
const {Preconditions} = require("../../Preconditions");
const {Broadcaster} = require("../../ipc/Broadcaster");

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

        // TODO: move this to a start method.
        ipcMain.on('context-menu-trigger', (event, triggerEvent) => {

            this.trigger(triggerEvent, event.sender);

        });

        new Broadcaster('create-annotation');

    }

    trigger(triggerEvent, sender) {

        Preconditions.assertNotNull(sender, "sender");

        let window = BrowserWindow.getFocusedWindow();

        //console.log("GOT IT for: contextMenuTypes: " + contextMenuTypes)
        //console.log("GOT IT for: matchingSelectors: " + JSON.stringify(matchingSelectors, null, "  "))

        const ctxMenu = this.createTextHighlightContextMenu(triggerEvent, sender);

        // The documentation for this looks wrong and it actually takes three
        // arguments not a object
        ctxMenu.popup(window, triggerEvent.point.x, triggerEvent.point.y);

    }

    cmdAddFlashcard(triggerEvent, sender) {

        Preconditions.assertNotNull(sender, "sender");

        sender.send('context-menu-create-flashcard', {
            command: "add-flashcard"
        });

        let context = {
            docDescriptor: triggerEvent.docDescriptor,
            matchingSelectors: triggerEvent.matchingSelectors
        };

        let contextJSON = JSON.stringify(context);

        let url = `http://${DEFAULT_HOST}:${WEBSERVER_PORT}/card-creator/index.html?context=${encodeURIComponent(contextJSON)}` ;

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

    cmdNotify(command, triggerEvent, sender) {

        // send the annotation BACK to the sender with the specific actions.

        // we're sending back LESS data because I think all of the original data
        // is probably not needed.
        let event = {
            command,
            matchingSelectors: triggerEvent.matchingSelectors,
            docDescriptor: triggerEvent.docDescriptor
        };

        sender.send("context-menu-command", event);

    }

    createTextHighlightContextMenu(triggerEvent, sender) {

        Preconditions.assertNotNull(sender, "sender");

        const ctxMenu = new Menu();

        let window = BrowserWindow.getFocusedWindow();

        // TODO: move this to a template as the code is cleaner

        if(triggerEvent.contextMenuTypes.includes(ContextMenuType.TEXT_HIGHLIGHT)) {

            ctxMenu.append(new MenuItem( {
                label: 'Add Flashcard',
                //accelerator: 'CmdOrCtrl+A',
                click: () => this.cmdAddFlashcard(triggerEvent, sender)
            }));

            ctxMenu.append(new MenuItem( {
                label: 'Delete Text Highlight',
                //accelerator: 'CmdOrCtrl+A',
                click: () => this.cmdNotify("delete-text-highlight", triggerEvent, sender)
            }));

        }

        // TODO: add a handler for pagemarks (ability to delete them, or change the type)
        // also "create pagemark here"

        ctxMenu.append(new MenuItem( {
            label: 'Inspect Element',
            id: "inspect",
            //accelerator: 'CmdOrCtrl+A',
            click: function (event) {

                // the points are SLIGHTLY off for the iframe version which is
                // very annoying.
                window.inspectElement(triggerEvent.point.x, triggerEvent.point.y);

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
