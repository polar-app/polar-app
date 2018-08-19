"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../../Preconditions");
class FrameEvents {
    static calculatePoints(iframe, mouseEvent) {
        Preconditions_1.Preconditions.assertNotNull(iframe, "iframe");
        if (!mouseEvent.target) {
            throw new Error("No target");
        }
        let targetElement = mouseEvent.target;
        if (targetElement.ownerDocument !== iframe.contentDocument) {
            throw new Error("Event did not occur in specified iframe");
        }
        let result = {
            page: {
                x: 0,
                y: 0
            },
            client: {
                x: 0,
                y: 0
            },
            offset: {
                x: 0,
                y: 0
            }
        };
        result.client.x = mouseEvent.screenX - window.screenX;
        let electronScreen = window.screen;
        result.client.y = mouseEvent.screenY - window.screenY - electronScreen.availTop;
        result.page.x = result.client.x;
        result.page.y = result.client.y;
        result.offset.x = mouseEvent.pageX;
        result.offset.y = mouseEvent.pageY;
        return result;
    }
}
exports.FrameEvents = FrameEvents;
//# sourceMappingURL=FrameEvents.js.map