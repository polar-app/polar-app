const {ipcRenderer} = require('electron')

class Receiver {

    constructor(name) {

        ipcRenderer.on(name, (event, arg) => {

        });

    }

}
