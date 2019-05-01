import {webextensions} from './WebExtensions';

const extensionIDs = [
    "nplbojledjdlbankapinifindadkdpnj", // dev
    "jkfdkjomocoaljglgddnmhcbolldcafd"  // prod
];

export class ExtensionInstall {

    public static async isInstalled(): Promise<boolean> {

        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {

            for (const extensionID of extensionIDs) {

                const result = await webextensions.Runtime.sendMessage(extensionID, {});

                if (result != null) {
                    // will be null if nothing saw the call
                    return result;
                }

            }

        }

        return false;

    }

}
