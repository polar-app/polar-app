import {DataURL} from './BrowserScreenshotHandler';

export namespace webextensions {

    export class Runtime {

        public static async sendMessage(extensionID: string, message: any): Promise<any> {

            return new Promise<any>(resolve => {
                chrome.runtime.sendMessage(extensionID, message, result => resolve(result));
            });

        }

    }

    export class Windows {

        public static async getCurrent(): Promise<chrome.windows.Window> {

            return new Promise(resolve => {

                chrome.windows.getCurrent(window => {
                    resolve(window);
                });

            });

        }

    }

    export class Tabs {

        public static async captureVisibleTab(): Promise<DataURL> {

            const win = await Windows.getCurrent();

            return new Promise(resolve => {

                chrome.tabs.captureVisibleTab(win.id, {format: 'png'}, dataURL => {
                    resolve(dataURL);
                });

            });

        }

    }

}
