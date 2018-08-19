import {ipcRenderer} from 'electron';
import {Model} from '../Model';
import {Elements} from '../util/Elements';
import {ContextMenuType, ContextMenuTypes} from './ContextMenuType';
import {MatchingSelector} from './MatchingSelector';
import {AnnotationDescriptors} from '../metadata/AnnotationDescriptors';
import {Logger} from '../logger/Logger';
import {TriggerEvent} from './TriggerEvent';
import {DocDescriptor} from '../metadata/DocDescriptor';

const {forDict} = require("../utils");
const {DocFormatFactory} = require("../docformat/DocFormatFactory");
const log = Logger.create();

/**
 * Handles listening for context menus and then calling back the proper handler.
 *
 * IPC messages:
 *
 * context-menu-create-flashcard: open the 'create flashcard' modal.
 */
export class ContextMenuController {

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

                let contextMenuTypes: ContextMenuType[] = [];

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

                ipcRenderer.send('context-menu-trigger', TriggerEvent.create({
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

    static toContextMenuType(selector: string): ContextMenuType {
        let result = selector.toUpperCase();
        result = result.replace(".", "");
        result = result.replace("-", "_");
        return ContextMenuTypes.fromString(result);
    }

    /**
     * Create a result by looking at all the events, and all the selectors,
     * building up an index of matching elements at the position.
     *
     * @param event
     * @param selectors
     */
     static elementsFromEventMatchingSelectors(event: any, selectors: string[]) {

        let result: {[key: string]: MatchingSelector} = {};

        selectors.forEach(selector => {
            result[selector] = new MatchingSelector(selector, [], []);
        });

        let elements = ContextMenuController.elementsFromEvent(event);

        elements.forEach((element: HTMLElement) => {

            selectors.forEach(selector => {

                if(element.matches(selector)) {

                    let matchingSelector = result[selector];

                    matchingSelector.elements.push(element);

                    let annotationDescriptor = AnnotationDescriptors.createFromElement(element);

                    if(annotationDescriptor) {
                        matchingSelector.annotationDescriptors.push(annotationDescriptor);
                    }
                }

            });

        });

        return result;

    }

}
