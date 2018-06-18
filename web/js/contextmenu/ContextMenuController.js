
const {ipcRenderer} = require('electron')
const {ContextMenuType} = require("./ContextMenuType");
const {forDict} = require("../utils");

/**
 * Handles listening for context menus and then calling back the proper handler.
 *
 * IPC messages:
 *
 * context-menu-create-flashcard: open the 'create flashcard' modal.
 */
class ContextMenuController {

    constructor() {

        ipcRenderer.on('context-menu-create-flashcard', (event, arg) => {
            console.log("GOT MESSAGE!!!", arg) // prints "ping"
        });

    }

    start() {

        console.log("Starting ContextMenuController");

        document.querySelectorAll("body").forEach(function(targetElement) {

            console.log("Adding contextmenu listener on", targetElement);

            targetElement.addEventListener("contextmenu", function (event) {

                console.log("got context menu");

                //let elements = document.elementsFromPoint(event.screenX, event.screenY);
                let annotationSelectors = [ ".text-highlight", ".pagemark" ];

                let elementsMatchingSelectors
                    = ContextMenuController.elementFromEventMatchingSelectors(event, annotationSelectors );

                let contextMenuTypes = [];

                forDict(elementsMatchingSelectors, function (key, current) {
                    if(current.elements.length > 0) {
                        contextMenuTypes.push(ContextMenuController.toContextMenuType(current.selector));
                    }
                });

                ipcRenderer.send('context-menu-trigger', {
                    point: {x: event.pageX, y: event.pageY },
                    contextMenuTypes
                })

            }.bind(this));

        }.bind(this));

    }

    static elementsFromEvent(event) {
        // relative to the viewport
        let point = {x: event.clientX, y: event.clientY};
        return event.target.ownerDocument.elementsFromPoint(point.x, point.y);
    }

    static toContextMenuType(selector) {
        let result = selector.toUpperCase();
        result = result.replace(".", "");
        result = result.replace("-", "_");
        return result;
    }

    /**
     * Create a result by looking at all the events, and all the selectors,
     * building up an index of matching elements at the position.
     *
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
