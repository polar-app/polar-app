/**
 * Calls an event handler when the page has been redrawn so that we can
 * attach annotations, pagemarks, etc.
 *
 * @deprecated Use the new {ContainerLifecycleListener} instead.
 * @type {PageRedrawHandler}
 */
class PageRedrawHandler {

    constructor(pageElement) {

        this.pageElement = pageElement;
        this.listener = null;

    }

    register(callback) {

        this.listener = event => {

            if (event.target && event.target.className === "endOfContent") {
                callback(this.pageElement);
            }

        };

        this.pageElement.addEventListener('DOMNodeInserted', this.listener, false);

    };

    unregister() {
        this.pageElement.removeEventListener('DOMNodeInserted', this.listener, false);
    }

}

module.exports.PageRedrawHandler = PageRedrawHandler;
