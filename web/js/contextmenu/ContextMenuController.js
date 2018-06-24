
const {ipcRenderer} = require('electron')
const {ContextMenuType} = require("./ContextMenuType");
const {forDict} = require("../utils");
const {Attributes} = require("../util/Attributes");

/**
 * Handles listening for context menus and then calling back the proper handler.
 *
 * IPC messages:
 *
 * context-menu-create-flashcard: open the 'create flashcard' modal.
 */
class ContextMenuController {

    constructor() {

        ipcRenderer.on('context-menu-command', (event, arg) => {
            console.log("GOT MESSAGE context-menu-command!!!", arg) // prints "ping"
        });

    }

    start() {

        // TODO: this should be refactored to make it testable with jsdom once
        // I get it working.

        console.log("Starting ContextMenuController");

        document.querySelectorAll("body").forEach((targetElement) => {

            console.log("Adding contextmenu listener on", targetElement);

            targetElement.addEventListener("contextmenu", (event) => {

                console.log("got context menu");

                let annotationSelectors = [ ".text-highlight", ".pagemark" ];

                let matchingSelectors
                    = ContextMenuController.elementsFromEventMatchingSelectors(event, annotationSelectors );

                let contextMenuTypes = [];

                forDict(matchingSelectors, function (selector, current) {
                    if(current.elements.length > 0) {
                        contextMenuTypes.push(ContextMenuController.toContextMenuType(current.selector));
                    }
                });

                ipcRenderer.send('context-menu-trigger', {
                    point: {x: event.pageX, y: event.pageY },
                    contextMenuTypes,
                    matchingSelectors
                })

            });

        });

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
     static elementsFromEventMatchingSelectors(event, selectors) {

        let result = {

        };

        // setup the selector result
        selectors.forEach(function (selector) {
            result[selector] = {
                selector,
                elements: [],
                /**
                 * Includes metadata about each annotation that is selected.
                 */
                annotationDescriptors: []
            }
        });

        let elements = ContextMenuController.elementsFromEvent(event);

        elements.forEach(function (element) {

            selectors.forEach(function (selector) {

                if(element.matches(selector)) {
                    result[selector].elements.push(element);
                    result[selector].annotationDescriptors.push(Attributes.dataToMap(element));
                }

            });

        });

        return result;

    }

}

module.exports.ContextMenuController = ContextMenuController;
