if (global.URL !== undefined) {
    // We're in Firefox
    module.exports = {
        makeUrlAbsolute(base: UtilURL, relative: string): string {
            return new URL(relative, base).href;
        },
        parseUrl(url: string): string {
            return new URL(url).host;
        }
    };
} else {
    // We're in Node.js
    const urlparse = require('url');
    module.exports = {
        makeUrlAbsolute(base: string, relative: string): string {
            const relativeParsed = urlparse.parse(relative);

            if (relativeParsed.host === null) {
                return urlparse.resolve(base, relative);
            }

            return relative;
        },
        parseUrl(url: UtilURL): string {
            return urlparse.parse(url).hostname;
        }
    };
}

type UtilURL = string | URL;