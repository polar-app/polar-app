"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TriggerEvent_1 = require("../TriggerEvent");
const electron_1 = require("electron");
const Logger_1 = require("../../logger/Logger");
const Arrays_1 = require("../../util/Arrays");
const { ContextMenuType } = require("../ContextMenuType");
const { ContextMenu } = require("../ContextMenu");
const { Preconditions } = require("../../Preconditions");
const { Broadcaster } = require("../../ipc/Broadcaster");
const { Messenger } = require("../../electron/messenger/Messenger");
const log = Logger_1.Logger.create();
class ElectronContextMenu extends ContextMenu {
    constructor() {
        super();
        this.messenger = new Messenger();
        electron_1.ipcMain.on('context-menu-trigger', (event, message) => {
            let triggerEvent = TriggerEvent_1.TriggerEvent.create(message);
            this.trigger(triggerEvent, event.sender);
        });
        new Broadcaster('create-annotation');
    }
    trigger(triggerEvent, sender) {
        Preconditions.assertNotNull(sender, "sender");
        let window = electron_1.BrowserWindow.getFocusedWindow();
        const ctxMenu = this.createContextMenu(triggerEvent, sender);
        ctxMenu.popup({
            window,
            x: triggerEvent.point.x,
            y: triggerEvent.point.y
        });
    }
    postContextMenuMessage(name, triggerEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("postContextMenuMessage: " + name);
            yield this.messenger.postMessage({
                message: {
                    type: name,
                    point: triggerEvent.point,
                    points: triggerEvent.points,
                    pageNum: triggerEvent.pageNum,
                    matchingSelectors: triggerEvent.matchingSelectors,
                    docDescriptor: triggerEvent.docDescriptor
                }
            });
        });
    }
    cmdNotify(command, triggerEvent, sender) {
        let event = {
            command,
            matchingSelectors: triggerEvent.matchingSelectors,
            docDescriptor: triggerEvent.docDescriptor
        };
        sender.send("context-menu-command", event);
    }
    createContextMenu(triggerEvent, sender) {
        Preconditions.assertNotNull(sender, "sender");
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
        const ctxMenu = new electron_1.Menu();
        Arrays_1.Arrays.createSiblings(contextMenus).forEach(contextMenuCursor => {
            contextMenuCursor.curr.items.forEach(menuItem => {
                ctxMenu.append(menuItem);
            });
            if (contextMenuCursor.curr.items.length > 0 && contextMenuCursor.next) {
                ctxMenu.append(new electron_1.MenuItem({
                    type: 'separator'
                }));
            }
        });
        return ctxMenu;
    }
    createTextHighlightContextMenu(triggerEvent, sender) {
        const ctxMenu = new electron_1.Menu();
        ctxMenu.append(new electron_1.MenuItem({
            label: 'Add Flashcard',
            click: () => this.postContextMenuMessage("create-flashcard", triggerEvent)
        }));
        ctxMenu.append(new electron_1.MenuItem({
            label: 'Delete Text Highlight',
            click: () => this.cmdNotify("delete-text-highlight", triggerEvent, sender)
        }));
        return ctxMenu;
    }
    createAreaHighlightContextMenu(triggerEvent, sender) {
        const ctxMenu = new electron_1.Menu();
        ctxMenu.append(new electron_1.MenuItem({
            label: 'Add Flashcard',
            click: () => this.postContextMenuMessage("create-flashcard", triggerEvent)
        }));
        ctxMenu.append(new electron_1.MenuItem({
            label: 'Delete Area Highlight',
            click: () => this.postContextMenuMessage("delete-area-highlight", triggerEvent)
        }));
        return ctxMenu;
    }
    createPagemarkContextMenu(triggerEvent, sender) {
        const ctxMenu = new electron_1.Menu();
        ctxMenu.append(new electron_1.MenuItem({
            label: 'Delete Pagemark',
            click: () => this.postContextMenuMessage("delete-pagemark", triggerEvent)
        }));
        return ctxMenu;
    }
    createPageContextMenu(triggerEvent, sender) {
        const ctxMenu = new electron_1.Menu();
        ctxMenu.append(new electron_1.MenuItem({
            label: 'Create Pagemark',
            click: () => this.postContextMenuMessage("create-pagemark", triggerEvent)
        }));
        ctxMenu.append(new electron_1.MenuItem({
            label: 'Create Area Highlight',
            click: () => this.postContextMenuMessage("create-area-highlight", triggerEvent)
        }));
        return ctxMenu;
    }
    createDefaultContextMenu(triggerEvent, sender) {
        const ctxMenu = new electron_1.Menu();
        let window = electron_1.BrowserWindow.getFocusedWindow();
        ctxMenu.append(new electron_1.MenuItem({
            label: 'Inspect Element',
            id: "inspect",
            click: event => {
                let window = electron_1.BrowserWindow.getFocusedWindow();
                if (!window) {
                    throw new Error("No current window");
                }
                window.webContents.inspectElement(triggerEvent.point.x, triggerEvent.point.y);
                if (window.webContents.isDevToolsOpened()) {
                    window.webContents.devToolsWebContents.focus();
                }
            }
        }));
        return ctxMenu;
    }
}
exports.ElectronContextMenu = ElectronContextMenu;
//# sourceMappingURL=ElectronContextMenu.js.map