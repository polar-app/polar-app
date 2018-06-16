const electron = require('electron');
const remote = electron.remote;
const {ContextMenuType} = require("../ContextMenuType");
const {ContextMenu} = require("../ContextMenu");

class ElectronContextMenu extends ContextMenu {

    trigger(point, contextMenuTypes) {

        let window = remote.getCurrentWindow();

        console.log("GOT IT for: " + contextMenuTypes)

        const ctxMenu = ElectronContextMenu.createTextHighlightContextMenu();

        ctxMenu.popup(window, point.x, point.y);

    }

    static createTextHighlightContextMenu() {

        // console.log("FIXME:3", electron.remote.Menu);
        // console.log("FIXME:4", new electron.remote.Menu());
        // console.log("FIXME:0", electron.Menu);
        // console.log("FIXME:1", Menu);
        // console.log("FIXME:2", Menu.buildFromTemplate);

        const ctxMenu = new electron.remote.Menu();

        ctxMenu.append(new electron.remote.MenuItem({ label: 'Add Flashcard', accelerator: 'CmdOrCtrl+A', click: function () {
                window.alert("hello world");
            } }));

        // ctxMenu.append(new MenuItem({ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' }))
        // ctxMenu.append(new MenuItem({ label: 'Inspect Element', accelerator: 'Ctrl+Shift+I', click: function () {
        //         window.inspectElement(screenX, screenY)
        //     } }));

        return ctxMenu;

    }

};

module.exports.ElectronContextMenu = ElectronContextMenu;
