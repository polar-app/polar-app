import {TriggerEvent} from '../TriggerEvent';
import {WebContents, Menu, MenuItem, BrowserWindow, ipcMain} from 'electron';
import {Logger} from '../../logger/Logger';
import PopupOptions = Electron.PopupOptions;
import {Arrays} from '../../util/Arrays';

const {ContextMenuType} = require("../ContextMenuType");
const {ContextMenu} = require("../ContextMenu");
const {Preconditions} = require("../../Preconditions");
const {Broadcaster} = require("../../ipc/Broadcaster");
const {Messenger} = require("../../electron/messenger/Messenger");

const log = Logger.create();

/**
 * Careful here as this is confusing.  We're using the REMOVE interface so the
 * context changes. This code is triggered from the renderer but then runs
 * in the main process.
 *
 * @ElectronMainContext
 */
export class ElectronContextMenu extends ContextMenu {

    constructor() {
        super();

        this.messenger = new Messenger();

        // TODO: move this to a start method.
        ipcMain.on('context-menu-trigger', (event: Electron.Event, message: any) => {

            let triggerEvent = TriggerEvent.create(message);

            this.trigger(triggerEvent, event.sender);

        });

        new Broadcaster('create-annotation');

    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     */
    trigger(triggerEvent: TriggerEvent, sender: WebContents) {

        Preconditions.assertNotNull(sender, "sender");

        let window = BrowserWindow.getFocusedWindow();

        //console.log("GOT IT for: contextMenuTypes: " + contextMenuTypes)
        //console.log("GOT IT for: matchingSelectors: " + JSON.stringify(matchingSelectors, null, "  "))

        const ctxMenu = this.createContextMenu(triggerEvent, sender);

        // The documentation for this looks wrong and it actually takes three
        // arguments not a object. Note that we should NOT include the mouse
        // point as by default it uses the mouse point anyway which is almost
        // always what we want.
        ctxMenu.popup(<PopupOptions>{
            window
        });

    }

    async postContextMenuMessage(name: string, triggerEvent: TriggerEvent) {

        log.info("postContextMenuMessage: " + name);

        // TODO: this should use its own type of ContextMenuMessage with the
        // ContextMenuLocation and a type field.

        // TODO: just send the full TriggerEvent but rename it to
        // ContextMenuSelectedEvent or something along those lines.

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
    cmdNotify(command: string, triggerEvent: TriggerEvent, sender: WebContents) {

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
    createContextMenu(triggerEvent: TriggerEvent, sender: WebContents) {

        Preconditions.assertNotNull(sender, "sender");

        // TODO: move this to a template as the code is cleaner

        let contextMenus: Menu[] = [];

        if (triggerEvent.contextMenuTypes.includes(ContextMenuType.PAGE)) {
            contextMenus.push(this.createPageContextMenu(triggerEvent, sender));
        }

        if (triggerEvent.contextMenuTypes.includes(ContextMenuType.TEXT_HIGHLIGHT)) {
            contextMenus.push(this.createTextHighlightContextMenu(triggerEvent, sender));
        }

        if (triggerEvent.contextMenuTypes.includes(ContextMenuType.AREA_HIGHLIGHT)) {
            contextMenus.push(this.createAreaHighlightContextMenu(triggerEvent, sender));
        }

        if (triggerEvent.contextMenuTypes.includes(ContextMenuType.PAGEMARK)) {
            contextMenus.push(this.createPagemarkContextMenu(triggerEvent, sender));
        }

        contextMenus.push(this.createDefaultContextMenu(triggerEvent, sender));

        const ctxMenu = new Menu();

        Arrays.createSiblings(contextMenus).forEach(contextMenuCursor => {

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
    createTextHighlightContextMenu(triggerEvent: TriggerEvent, sender: WebContents): Menu {

        const ctxMenu = new Menu();

        ctxMenu.append(this.createSubmenu('Text Highlight', [
            new MenuItem({
                label: 'Add Flashcard',
                //accelerator: 'CmdOrCtrl+A',
                click: () => this.postContextMenuMessage("add-flashcard", triggerEvent)
            }),
            new MenuItem({
                label: 'Delete',
                //accelerator: 'CmdOrCtrl+A',
                click: () => this.cmdNotify("delete-text-highlight", triggerEvent, sender)
            })
        ]));

        return ctxMenu;

    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     * @return {Electron.Menu}
     */
    createAreaHighlightContextMenu(triggerEvent: TriggerEvent, sender: WebContents): Menu {

        const ctxMenu = new Menu();

        ctxMenu.append(this.createSubmenu('Area Highlight', [
            new MenuItem({
                label: 'Add Flashcard',
                click: () => this.postContextMenuMessage("add-flashcard", triggerEvent)
            }),
            new MenuItem({
                label: 'Delete',
                //accelerator: 'CmdOrCtrl+A',
                click: () => this.postContextMenuMessage("delete-area-highlight", triggerEvent)
            })
        ]));

        return ctxMenu;

    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     * @return {Electron.Menu}
     */
    createPagemarkContextMenu(triggerEvent: TriggerEvent, sender: WebContents): Menu {

        const ctxMenu = new Menu();

        ctxMenu.append(this.createSubmenu('Pagemark', [
            new MenuItem({
                label: 'Delete Pagemark',
                //accelerator: 'CmdOrCtrl+A',
                click: () => this.postContextMenuMessage("delete-pagemark", triggerEvent)
            })
        ]));

        return ctxMenu;

    }

    /**
     *
     * @param triggerEvent {TriggerEvent}
     * @param sender
     * @return {Electron.Menu}
     */
    createPageContextMenu(triggerEvent: TriggerEvent, sender: WebContents): Menu {

        const ctxMenu = new Menu();

        // TODO: page highlights don't work right now as we need an annotation
        // to base it off of.
        // ctxMenu.append(new MenuItem({
        //     label: 'Add Flashcard',
        //     //accelerator: 'CmdOrCtrl+A',
        //     click: () => this.postContextMenuMessage("add-flashcard", triggerEvent)
        // }));

        ctxMenu.append(new MenuItem({
            label: 'Create Pagemark',
            click: () => this.postContextMenuMessage("create-pagemark", triggerEvent)
        }));

        ctxMenu.append(new MenuItem({
            label: 'Create Area Highlight',
            click: () => this.postContextMenuMessage("create-area-highlight", triggerEvent)
        }));

        ctxMenu.append(new MenuItem({
            label: 'Sync',
            click: () => this.postContextMenuMessage("start-sync", triggerEvent)
        }));


        // ctxMenu.append(new MenuItem({
        //     label: 'Create Annotation',
        //     click: () => this.postContextMenuMessage("create-annotation", triggerEvent)
        // }));

        return ctxMenu;

    }

    /**
     *
     * @param triggerEvent
     * @param sender
     * @return {Electron.Menu}
     */
    createDefaultContextMenu(triggerEvent: TriggerEvent, sender: WebContents): Menu {

        const ctxMenu = new Menu();

        let window = BrowserWindow.getFocusedWindow();

        // TODO: display this first and only if text is highlighted
        // ctxMenu.append(new MenuItem({ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' }));

        ctxMenu.append(new MenuItem({
            label: 'Inspect Element',
            id: "inspect",
            //accelerator: 'Ctrl+Shift+I',
            click: event => {

                let window = BrowserWindow.getFocusedWindow();

                if(! window) {
                    throw new Error("No current window");
                }

                // the points are SLIGHTLY off for the iframe version which is
                // very annoying.
                window.webContents.inspectElement(triggerEvent.point.x, triggerEvent.point.y);

                if (window.webContents.isDevToolsOpened()) {
                    window.webContents.devToolsWebContents.focus();
                }

            }

        }));

        return ctxMenu;

    }

    createSubmenu(label: string, menuItems: MenuItem[]): MenuItem {

        let submenu = new Menu();

        let submenuItem = new MenuItem({
            label,
            type: 'submenu',
            submenu
        });

        menuItems.forEach(menuItem => {
            submenu.append(menuItem);
        });

        return submenuItem;

    }

}
