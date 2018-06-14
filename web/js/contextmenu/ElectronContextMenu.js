const electron = require('electron');
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
module.exports.ElectronContextMenu = class {

    constructor() {


    }

    // register(element, type, callback) {
    //
    // }

    popup(window, screenX, screenY) {

        console.log("GOT IT")

        const ctxMenu = new Menu();
        // ctxMenu.append(new MenuItem({
        //     label: "hello"
        // }));

        ctxMenu.append(new MenuItem({ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' }))
        //
        // window.webContents.on("context-menu", function (e, params) {
        //     console.log("FIXME e", params);
        //     console.log("FIXME params: ", params)
        //
        // });

        ctxMenu.popup(window, screenX, screenY);
    }

};
