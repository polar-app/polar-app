import {SaveToPolarHandler} from "./SaveToPolarHandler";
import {MockChrome} from "../MockChrome";
import {FirebaseBrowserTesting} from "polar-firebase-browser/src/firebase/FirebaseBrowserTesting";
import {assertJSON} from "polar-bookshelf/web/js/test/Assertions";
import { Arrays } from "polar-shared/src/util/Arrays";

describe("SaveToPolarHandler", function() {

    it("load page", async () => {

        const interactions = MockChrome.createChromeAndInject();

        await FirebaseBrowserTesting.authWithUser0();

        await SaveToPolarHandler.handleMessage({
            "type": "save-to-polar",
            "strategy": "epub",
            "value": {
                "icon": "http://localhost:9876/favicon.ico",
                "url": "http://localhost:9876/context.html",
                "text": "hello world",
                "content": "<div>hello world</div>"
            }
        }, {tab: {id: 101}});

        const update = Arrays.last(interactions);
        (update as any).updateProperties.url = 'xxx'

        assertJSON(update, {
            "op": "chrome.tabs.update",
            "id": 1,
            "updateProperties": {
                "url": "xxx"
            }
        });

    });

})


