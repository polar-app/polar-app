import {SaveToPolarHandler} from "./SaveToPolarHandler";
import {MockChrome} from "../MockChrome";

const interactions = MockChrome.createChromeAndInject();

describe("SaveToPolarHandler", function() {

    it("load page", () => {

        SaveToPolarHandler.handleMessage({
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


