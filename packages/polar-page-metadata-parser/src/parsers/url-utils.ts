if (global.URL !== undefined) {
    // We're in Firefox
    module.exports = {
        makeUrlAbsolute(base: UtilURL, relative: UtilURL) {
            return new URL(relative, base).href;
        },
        parseUrl(url: UtilURL) {
            return new URL(url).host;
        }
    };
} else {
    // We're in Node.js
    const urlparse = require('url');
    module.exports = {
        makeUrlAbsolute(base: UtilURL, relative: UtilURL) {
            const relativeParsed = urlparse.parse(relative);

            if (relativeParsed.host === null) {
                return urlparse.resolve(base, relative);
            }

            return relative;
        },
        parseUrl(url: UtilURL) {
            return urlparse.parse(url).hostname;
        }
    };
}

type UtilURL = string | URL;