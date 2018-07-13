class Electron {

    static isElectron() {
        var userAgent = navigator.userAgent.toLowerCase();
        return userAgent.indexOf(' electron/') !== -1;
    }

}

module.exports.Electron = Electron;
