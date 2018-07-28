import Model from '../Model';

const {ipcRenderer} = require('electron')
const {ContextMenuType} = require("./ContextMenuType");
const {forDict} = require("../utils");
const {Attributes} = require("../util/Attributes");
const {TriggerEvent} = require("./TriggerEvent");
const {DocFormatFactory} = require("../docformat/DocFormatFactory");
const {DocDescriptor} = require("../metadata/DocDescriptor");
const {Preconditions} = require("../Preconditions");
const {Elements} = require("../util/Elements");
const log = require("../logger/Logger").create();

/**
 * Handles listening for context menus and then calling back the proper handler.
 *
 * IPC messages:
 *
 * context-menu-create-flashcard: open the 'create flashcard' modal.
 */
class ContextMenuController {

    private model: Model;

    constructor(model: Model) {
        this.model = model;

        ipcRenderer.on('context-menu-command', (event: any, arg: any) => {

            // I don't think we need to listen to these here but rather in the
            // specific controllers.

        });

    }

    start() {

        // TODO: this should be refactored to make it testable with jsdom once
        // I get it working.

        console.log("Starting ContextMenuController");

        document.querySelectorAll(".page").forEach((targetElement) => {

            targetElement.addEventListener("contextmenu", /** @type {MouseEvent} */ (event: any) => {

                let annotationSelectors = [ ".text-highlight", ".area-highlight", ".pagemark", ".page" ];

                let matchingSelectors
                    = ContextMenuController.elementsFromEventMatchingSelectors(event, annotationSelectors );

                let contextMenuTypes: any[] = [];

                forDict(matchingSelectors, function (selector: any, current: any) {
                    if(current.elements.length > 0) {
                        contextMenuTypes.push(ContextMenuController.toContextMenuType(current.selector));
                    }
                });

                let docDescriptor = new DocDescriptor({
                    fingerprint: this.model.docMeta.docInfo.fingerprint
                });

                log.info("Creating context menu for contextMenuTypes: ", contextMenuTypes);

                let pageElement = Elements.untilRoot(event.target, ".page");

                let docFormat = DocFormatFactory.getInstance();

                let pageNum = docFormat.getPageNumFromPageElement(pageElement);

                let eventTargetOffset = Elements.getRelativeOffsetRect(event.target, pageElement);

                // compute the offset of the event relative to the page we're
                // viewing
                let pageOffset = {

                    x: eventTargetOffset.left + event.offsetX,
                    y: eventTargetOffset.top + event.offsetY

                };

                ipcRenderer.send('context-menu-trigger', new TriggerEvent({
                    point: {
                        x: event.pageX,
                        y: event.pageY
                    },
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
                        },
                        pageOffset
                    },
                    pageNum,
                    contextMenuTypes,
                    matchingSelectors,
                    docDescriptor
                }));

            });

        });

    }

    static elementsFromEvent(event: any) {

        // the point must be relative to the viewport
        let point = {x: event.clientX, y: event.clientY};

        let doc = event.target.ownerDocument;

        return doc.elementsFromPoint(point.x, point.y);

    }

    static toContextMenuType(selector: string) {
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
     static elementsFromEventMatchingSelectors(event: any, selectors: any) {

        let result: any = {

        };

        // setup the selector result
        selectors.forEach(function (selector: any) {
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

        elements.forEach(function (element: any) {

            selectors.forEach(function (selector: any) {

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
