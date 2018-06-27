/**
 * A browser that implements paging of the UI.
 */
const PagingBrowser = require("./PagingBrowser").PagingBrowser;
const {Functions} = require("../../../util/Functions");

class DefaultPagingBrowser extends PagingBrowser {

    /**
     *
     * @param webContents {Electron.WebContents}
     */
    constructor(webContents) {
        super();
        this.webContents = webContents;
    }

    /**
     * Return the scroll position.
     * @Override
     */
    async scrollToPosition(scrollPosition) {

        function __scrollToPosition(scrollPosition) {
            window.scrollX = scrollPosition.x;
            window.scrollY = scrollPosition.y;
        }

        let javascript = Functions.functionToScript(__scrollToPosition, scrollPosition);

        await this.webContents.executeJavaScript(javascript);

    }

    async state() {

        function __state() {

            return {

                scrollPosition: {
                    x: window.scrollX,
                    y: window.scrollY
                },

                scrollBox: {
                    width: document.body.scrollWidth,
                    height: document.body.scrollHeight,
                },

                viewportBox: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                }

            };

        }

        let javascript = Functions.functionToScript(__state);

        return await this.webContents.executeJavaScript(javascript);

    }
}

module.exports.DefaultPagingBrowser = DefaultPagingBrowser;
