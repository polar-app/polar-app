import {SaveToPolarHandler} from "./SaveToPolarHandler";
import {MockChrome} from "../MockChrome";

describe("SaveToPolarHandler", function() {

    it("load page", async () => {

        MockChrome.createChromeAndInject();

        // FIXME: ok this is the bug... we're handling the message BUT we're not
        // waiting for the result...

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

    });

})


