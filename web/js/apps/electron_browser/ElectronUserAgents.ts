/**
 * TODO: This won't work on Electron 5.x due to a bug where a 'virtual' page visit causes
 * an ERR_ABORTED.  I didn't want to enable this to avoid breaking something.
 */
const ENABLE_CONFIGURED_USER_AGENT = true;

export class ElectronUserAgents {

    public static configureForWebContents(webContents: Electron.WebContents) {

        if (ENABLE_CONFIGURED_USER_AGENT) {
            const ua = webContents.userAgent;
            const newUA = ElectronUserAgents.computeUserAgent(ua);
            webContents.userAgent = newUA;
        }

    }

    public static computeUserAgent(userAgent: string) {

        // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) polar-bookshelf/1.60.14 Chrome/73.0.3683.121 Electron/5.0.11 Safari/537.36"
        userAgent = userAgent.replace(/Electron\/[0-9.]+ /, '');
        userAgent = userAgent.replace(/polar-bookshelf\/[0-9.]+ /, '');
        return userAgent;

    }

}
