const {ElectronContextMenu} = require("./electron/ElectronContextMenu");
const {ContextMenuType} = require("./ContextMenuType");

/**
 * Handles listening for context menus and then calling back the proper handler.
 */
class ContextMenuController {

    constructor() {
        this.contextMenu = new ElectronContextMenu();
    }

    start() {

        console.log("Starting ContextMenuController");

        document.querySelectorAll("body").forEach(function(targetElement) {

            console.log("Adding contextmenu listener on", targetElement);

            targetElement.addEventListener("contextmenu", function (event) {

                console.log("got context menu");

                //let elements = document.elementsFromPoint(event.screenX, event.screenY);
                let annotationSelectors = [".text-highlight", ".pagemark"];

                let elementsMatchingSelectors
                    = ContextMenuController.elementFromEventMatchingSelectors(event, annotationSelectors );

                console.log("FIXME: elementsMatchingSelectors", elementsMatchingSelectors);

                this.contextMenu.trigger({x: event.pageX, y: event.pageY }, [ContextMenuType.TEXT_HIGHLIGHT])

            }.bind(this));

        }.bind(this));

    }

    static elementsFromEvent(event) {
        let point = {x: event.pageX, y: event.pageY};
        return document.elementsFromPoint(point.x, point.y);
    }

    /**
     * Create a result by looking at all the events, and all the selectors, building
     * up an index of matching elements at the position.
     * @param event
     * @param selectors
     */
     static elementFromEventMatchingSelectors(event, selectors) {

        let result = {

        };

        // setup the selector result
        selectors.forEach(function (selector) {
            result[selector] = {
                selector, elements: []
            }
        });

        let elements = ContextMenuController.elementsFromEvent(event);

        elements.forEach(function (element) {

            selectors.forEach(function (selector) {

                if(element.matches(selector)) {
                    result[selector].elements.push(element);
                }

            });

        });

        return result;

    }

}

module.exports.ContextMenuController = ContextMenuController;
