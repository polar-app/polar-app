import {ipcRenderer} from "electron";

export namespace ElectronIpcRenderers {

    export function on(channelName: string, callback: (event: Electron.IpcRendererEvent, message: any) => void) {

        ipcRenderer.on(channelName, (event, message: any) => {

            callback(event, message)

        });

    }

}
