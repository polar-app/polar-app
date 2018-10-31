import {ipcRenderer} from 'electron';

/**
 * @ElectronRendererContext
 */
export class AppInstance {

    public static notifyStarted(name: string) {
        ipcRenderer.send('app-instance-started:' + name);
    }

}
