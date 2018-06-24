/**
 * Basic structure for defining
 *
 */
module.exports = {

    // Stock Electron UA is:
    //
    // Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) polar-bookshelf/1.0.0-beta13 Chrome/61.0.3163.100 Electron/2.0.2 Safari/537.36

    MOBILE_GALAXY_S8: {

        name: "MOBILE_GALAXY_S8",
        userAgent: "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.81 Mobile Safari/537.36",

        deviceEmulation: {
            screenPosition: "mobile",
            screenSize: {
                width: 412,
                height: 846
            },
            viewSize: {
                width: 412,
                height: 846
            }

        }

    },

    MOBILE_GALAXY_S8_WITH_CHROME_61: {

        name: "MOBILE_GALAXY_S8_WITH_CHROME_61",
        userAgent: "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Mobile Safari/537.36",

        deviceEmulation: {
            screenPosition: "mobile",
            screenSize: {
                width: 412,
                height: 846
            },
            viewSize: {
                width: 412,
                height: 846
            }

        }

    }

};
