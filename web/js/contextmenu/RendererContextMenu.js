const remote = require('electron').remote;

module.exports.RendererContextMenu = class {

    constructor() {

        console.log("FIXME: here at least..");

        document.addEventListener("contextmenu", function (event) {

            let electronContextMenu = remote.getGlobal("electronContextMenu" );

            console.log("FIXME: electronContextMenu: ", electronContextMenu)

            console.log("FIXME: Got context menu!");

            //remote.getCurrentWindow(), event.screenX, event.screenY

            electronContextMenu.popup(remote.getCurrentWindow(), event.screenX, event.screenY);

        })

    }

};
