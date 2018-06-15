const electron = require('electron');
const remote = electron.remote;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const {ContextMenuType} = require("./ContextMenuType");

module.exports.ElectronContextMenu = class {

    constructor() {


    }

    // register(element, type, callback) {
    //
    // }

    popup(window, screenX, screenY, contextMenuType) {

        console.log("GOT IT for: " + ContextMenuType)

        const ctxMenu = new Menu();
        // ctxMenu.append(new MenuItem({
        //     label: "hello"
        // }));

        ctxMenu.append(new MenuItem({ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' }))
        ctxMenu.append(new MenuItem({ label: 'Inspect Element', accelerator: 'Ctrl+Shift+I', click: function () {
                window.inspectElement(screenX, screenY)
            } }));

        ctxMenu.popup(window, screenX, screenY);
    }

};
