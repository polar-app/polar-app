import {ContentCaptureContext} from "./ContentCaptureContext";
import {ContentCaptureContextEPUB} from "./ContentCaptureContextEPUB";
import {assertJSON} from "polar-bookshelf/web/js/test/Assertions";

// eslint-disable-next-line no-var
declare var window: any;

const [interactions, chrome] = createChrome();

window.chrome = chrome;

function createChrome() {

    interface IOPSendMessageInteraction {
        op: 'sendMessage',
        message: any
    }

    const interactions: IOPSendMessageInteraction[] = [];

    const chrome = {
        runtime: {
            onMessage: {
                addListener: () => console.log('MOCK chrome: addListener called'),
                removeListener: () => console.log('MOCK chrome: removeListener called')
            },
            sendMessage: (message: any) => {
                console.log("MOCK chrome: Sending message: ", message);
                interactions.push({op: 'sendMessage', message});
            }
        }
    }

    return [interactions, chrome]

}

describe("ContentCaptureContext", function() {

    it("load page", () => {

        document.body.innerHTML = 'hello world';
        ContentCaptureContextEPUB.handleStartCaptureWithEPUB();

        document.querySelector('button')!.click();

        // at this point we just have the react content rendered with a button.

        // TODO: click the button or do what the button does directly

        assertJSON(interactions, [
            {
                "op": "sendMessage",
                "message": {
                    "type": "save-to-polar",
                    "strategy": "epub",
                    "value": {
                        "icon": "http://localhost:9876/favicon.ico",
                        "url": "http://localhost:9876/context.html",
                        "text": "hello world",
                        "content": "<div>hello world</div>"
                    }
                }
            }
        ]);

    });

})


