export class Electron {

    static isElectron() {
        let userAgent = navigator.userAgent.toLowerCase();
        return userAgent.indexOf(' electron/') !== -1;
    }

}
