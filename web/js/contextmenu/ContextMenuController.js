
const {ipcRenderer} = require('electron')
const {ContextMenuType} = require("./ContextMenuType");
const {forDict} = require("../utils");
const {Attributes} = require("../util/Attributes");
const {TriggerEvent} = require("./TriggerEvent");
const {DocDescriptor} = require("../metadata/DocDescriptor");
const {Preconditions} = require("../Preconditions");
const log = require("../logger/Logger").create();

/**
 * Handles listening for context menus and then calling back the proper handler.
 *
 * IPC messages:
 *
 * context-menu-create-flashcard: open the 'create flashcard' modal.
 */
class ContextMenuController {

    constructor(model) {

        this.model = Preconditions.assertNotNull(model, "model");

        ipcRenderer.on('context-menu-command', (event, arg) => {

            // I don't think we need to listen to these here but rather in the
            // specific controllers.

        });

    }

    start() {

        // TODO: this should be refactored to make it testable with jsdom once
        // I get it working.

        console.log("Starting ContextMenuController");

        document.querySelectorAll(".page").forEach((targetElement) => {

            console.log("Adding contextmenu listener on", targetElement);

            targetElement.addEventListener("contextmenu", /** @type {MouseEvent} */ (event) => {

                let annotationSelectors = [ ".text-highlight", ".area-highlight", ".pagemark", ".page" ];

                let matchingSelectors
                    = ContextMenuController.elementsFromEventMatchingSelectors(event, annotationSelectors );

                let contextMenuTypes = [];

                forDict(matchingSelectors, function (selector, current) {
                    if(current.elements.length > 0) {
                        contextMenuTypes.push(ContextMenuController.toContextMenuType(current.selector));
                    }
                });

                let docDescriptor = new DocDescriptor({
                    fingerprint: this.model.docMeta.docInfo.fingerprint
                });

                log.info("Creating context menu for contextMenuTypes: ", contextMenuTypes);

                ipcRenderer.send('context-menu-trigger', new TriggerEvent({
                    point: {x: event.pageX, y: event.pageY },
                    points: {
                        page: {
                            x: event.pageX,
                            y: event.pageY
                        },
                        client: {
                            x: event.clientX,
                            y: event.clientY
                        },
                        offset: {
                            x: event.offsetX,
                            y: event.offsetY
                        }
                    },
                    contextMenuTypes,
                    matchingSelectors,
                    docDescriptor
                }));

            });

        });

    }

    static elementsFromEvent(event) {

        // the point must be relative to the viewport
        let point = {x: event.clientX, y: event.clientY};

        let doc = event.target.ownerDocument;

        return doc.elementsFromPoint(point.x, point.y);

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
