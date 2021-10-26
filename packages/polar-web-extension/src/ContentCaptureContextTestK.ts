import {ContentCaptureContextEPUB} from "./ContentCaptureContextEPUB";
import {assertJSON} from "polar-bookshelf/web/js/test/Assertions";
import {MockChrome} from "./MockChrome";

describe("ContentCaptureContext", function() {

    it("load page", () => {

        const interactions = MockChrome.createChromeAndInject();

        document.body.innerHTML = 'hello world';
        ContentCaptureContextEPUB.handleStartCaptureWithEPUB();

        document.querySelector('button')!.click();

        // at this point we just have the react content rendered with a button.

        // TODO: click the button or do what the button does directly

        assertJSON(interactions, [
            {
                "op": "chrome.runtime.sendMessage",
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


