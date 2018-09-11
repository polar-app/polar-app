import WebContents = Electron.WebContents;

export class WindowChannels {

    public static create(webContents: WebContents,
                         channel: string) {

        return this.createFromID(webContents.id, channel);

    }

    public static createFromID(id: number, channel: string) {
        return id + "::" + channel;
    }

}
