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

        function canonicalizeInteractions(interactions: any) {

            function canonicalizeURL(url: string) {
                return url.replace(/^http:\/\/localhost:[0-9]+/, "http://localhost:1234");
            }

            interactions[0].message.value.url = canonicalizeURL(interactions[0].message.value.url);
            interactions[0].message.value.icon = canonicalizeURL(interactions[0].message.value.icon);

            return interactions;

        }

        assertJSON(canonicalizeInteractions(interactions), [
            {
                "op": "chrome.runtime.sendMessage",
                "message": {
                    "type": "save-to-polar",
                    "strategy": "epub",
                    "value": {
                        "icon": "http://localhost:1234/favicon.ico",
                        "url": "http://localhost:1234/context.html",
                        "text": "hello world",
                        "content": "<div>hello world</div>"
                    }
                }
            }
        ]);

    });

})


