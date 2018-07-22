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
const {createSiblings} = require("../../util/Functions");
const {Messenger} = require("../../electron/messenger/Messenger");
const log = require("../../logger/Logger").create();

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

        this.messenger = new Messenger();

        // TODO: move this to a start method.
        ipcMain.on('context-menu-trigger', (event, triggerEvent) => {

            this.trigger(triggerEvent, event.sender);

        });

        new Broadcaster('create-annotation');

    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     */
    trigger(triggerEvent, sender) {

        Preconditions.assertNotNull(sender, "sender");

        let window = BrowserWindow.getFocusedWindow();

        //console.log("GOT IT for: contextMenuTypes: " + contextMenuTypes)
        //console.log("GOT IT for: matchingSelectors: " + JSON.stringify(matchingSelectors, null, "  "))

        const ctxMenu = this.createContextMenu(triggerEvent, sender);

        // The documentation for this looks wrong and it actually takes three
        // arguments not a object
        ctxMenu.popup(window, triggerEvent.point.x, triggerEvent.point.y);

    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     */
    async cmdAddFlashcard(triggerEvent, sender) {

        // Preconditions.assertNotNull(sender, "sender");
        //
        // sender.send('context-menu-create-flashcard', {
        //     command: "add-flashcard"
        // });
        //
        // let context = {
        //     docDescriptor: triggerEvent.docDescriptor,
        //     matchingSelectors: triggerEvent.matchingSelectors
        // };
        //
        // let contextJSON = JSON.stringify(context);
        //
        // let url = `http://${DEFAULT_HOST}:${WEBSERVER_PORT}/apps/card-creator/index.html?context=${encodeURIComponent(contextJSON)}`;
        //
        // DialogWindow.create({url});

        // FIXME: AnnotationsController now needs document.addEventListener("message");

        let context = {
            docDescriptor: triggerEvent.docDescriptor,
            matchingSelectors: triggerEvent.matchingSelectors
        };

        await this.messenger.postMessage({
            message: {
                type: "create-flashcard",
                context
            }
        })

    }

    async postContextMenuMessage(name, triggerEvent) {

        log.info("postContextMenuMessage: " + name);

        // TODO: this should use its own type of ContextMenuMessage with the
        // ContextMenuLocation and a type field.

        // TODO: just send the full TriggerEvent but rename it to
        // ContextMenuSelectedEvent or something along those lines.

        // FIXME: we can't actually do this because matchingSelectors has elements
        // which will not be serialized as JSON to the renderer.

        await this.messenger.postMessage({
            message: {
                type: name,
                point: triggerEvent.point,
                points: triggerEvent.points,
                pageNum: triggerEvent.pageNum,
                matchingSelectors: triggerEvent.matchingSelectors,
                docDescriptor: triggerEvent.docDescriptor
            }
        })

    }

    /**
     * Send the annotation BACK to the sender with the specific actions to take.
     *
     * @deprecated Move to postContextMenuMessage
     * @param command
     * @param triggerEvent
     * @param sender
     */
    cmdNotify(command, triggerEvent, sender) {

        // we're sending back LESS data because I think all of the original data
        // is probably not needed.
        let event = {
            command,
            matchingSelectors: triggerEvent.matchingSelectors,
            docDescriptor: triggerEvent.docDescriptor
        };

        sender.send("context-menu-command", event);

    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     */
    createContextMenu(triggerEvent, sender) {

        Preconditions.assertNotNull(sender, "sender");

        // TODO: move this to a template as the code is cleaner

        let contextMenus = [];

        if (triggerEvent.contextMenuTypes.includes(ContextMenuType.TEXT_HIGHLIGHT)) {
            contextMenus.push(this.createTextHighlightContextMenu(triggerEvent, sender));
        }

        if (triggerEvent.contextMenuTypes.includes(ContextMenuType.AREA_HIGHLIGHT)) {
            contextMenus.push(this.createAreaHighlightContextMenu(triggerEvent, sender));
        }

        if (triggerEvent.contextMenuTypes.includes(ContextMenuType.PAGE)) {
            contextMenus.push(this.createPageContextMenu(triggerEvent, sender));
        }

        if (triggerEvent.contextMenuTypes.includes(ContextMenuType.PAGEMARK)) {
            contextMenus.push(this.createPagemarkContextMenu(triggerEvent, sender));
        }

        contextMenus.push(this.createDefaultContextMenu(triggerEvent, sender));

        const ctxMenu = new Menu();

        createSiblings(contextMenus).forEach(contextMenuCursor => {

            contextMenuCursor.curr.items.forEach(menuItem => {
                ctxMenu.append(menuItem);
            });

            if(contextMenuCursor.curr.items.length > 0 && contextMenuCursor.next) {
                ctxMenu.append(new MenuItem({
                    type: 'separator'
                }));
            }

        });

        return ctxMenu;

    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     * @return {Electron.Menu}
     */
    createTextHighlightContextMenu(triggerEvent, sender) {

        const ctxMenu = new Menu();

        ctxMenu.append(new MenuItem({
            label: 'Add Flashcard',
            //accelerator: 'CmdOrCtrl+A',
            click: () => this.cmdAddFlashcard(triggerEvent, sender)
        }));

        ctxMenu.append(new MenuItem({
            label: 'Delete Text Highlight',
            //accelerator: 'CmdOrCtrl+A',
            click: () => this.cmdNotify("delete-text-highlight", triggerEvent, sender)
        }));

        return ctxMenu;

    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     * @return {Electron.Menu}
     */
    createAreaHighlightContextMenu(triggerEvent, sender) {

        const ctxMenu = new Menu();

        ctxMenu.append(new MenuItem({
            label: 'Add Flashcard',
            //accelerator: 'CmdOrCtrl+A',
            click: () => this.cmdAddFlashcard(triggerEvent, sender)
        }));

        ctxMenu.append(new MenuItem({
            label: 'Delete Area Highlight',
            //accelerator: 'CmdOrCtrl+A',
            click: () => this.postContextMenuMessage("delete-area-highlight", triggerEvent)
        }));

        return ctxMenu;

    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     * @return {Electron.Menu}
     */
    createPagemarkContextMenu(triggerEvent, sender) {

        const ctxMenu = new Menu();

        // ctxMenu.append(new MenuItem({
        //     label: 'Delete Pagemark',
        //     click: () => this.cmdCreatePagemark(triggerEvent, sender)
        // }));

        return ctxMenu;

    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     * @return {Electron.Menu}
     */
    createPageContextMenu(triggerEvent, sender) {

        const ctxMenu = new Menu();

        ctxMenu.append(new MenuItem({
            label: 'Create Pagemark',
            click: () => this.postContextMenuMessage("create-pagemark", triggerEvent)
        }));

        ctxMenu.append(new MenuItem({
            label: 'Create Area Highlight',
            click: () => this.postContextMenuMessage("create-area-highlight", triggerEvent)
        }));

        return ctxMenu;

    }

    /**
     *
     * @param triggerEvent
     * @param sender
     * @return {Electron.Menu}
     */
    createDefaultContextMenu(triggerEvent, sender) {

        const ctxMenu = new Menu();

        let window = BrowserWindow.getFocusedWindow();

        // TODO: display this first and only if text is highlighted
        // ctxMenu.append(new MenuItem({ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' }));

        ctxMenu.append(new MenuItem({
            label: 'Inspect Element',
            id: "inspect",
            //accelerator: 'Ctrl+Shift+I',
            click: event => {

                // the points are SLIGHTLY off for the iframe version which is
                // very annoying.
                window.inspectElement(triggerEvent.point.x, triggerEvent.point.y);

                if (window.webContents.isDevToolsOpened()) {
                    window.webContents.devToolsWebContents.focus();
                }

            }

        }));

        // ctxMenu.append(new MenuItem({ label: 'Inspect Element', accelerator: 'Ctrl+Shift+I', click: function () {
        //         window.inspectElement(screenX, screenY)
        //     } }));

        return ctxMenu;

    }

}

module.exports.ElectronContextMenu = ElectronContextMenu;
