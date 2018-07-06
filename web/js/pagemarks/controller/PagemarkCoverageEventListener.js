const $ = require('jquery');

const {OffsetCalculator} = require("../../utils.js");
const {KeyEvents} = require("../../KeyEvents.js");
const {Elements} = require("../../util/Elements");
const {DocFormats} = require("../../docformat/DocFormats");

const BORDER_PADDING = 9;

class PagemarkCoverageEventListener {

    /**
     * @param controller {WebController}
     */
    constructor(controller) {
        this.controller = controller;
        this.keyActivated = false;
    }

    start() {
        document.addEventListener("keyup", this.keyListener.bind(this));
        document.addEventListener("keydown", this.keyListener.bind(this));
        document.addEventListener("click", this.mouseListener.bind(this));
    }

    /**
     * Track that we've selected 'e' on the keyboard,
     */
    keyListener(event) {

        //console.log(event);

        if(!event) {
            throw new Error("no event");
        }

        this.keyActivated = KeyEvents.isKeyMetaActive(event);

    }

    async mouseListener(event) {

        if(!event) {
            throw new Error("no event");
        }

        if(!this.keyActivated) {
            return;
        }

        await this.onActivated(event);

    }

    // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
    async onActivated(event) {

        let state = this.getPointerState(event);

        if(state.error) {
            console.error(state.error);
            return;
        }

        console.log("Pointer state: ", JSON.stringify(state, null, "  "));

        // FIXME: based on the pageType and other settings determine the width
        // and height of the new pagemark. Also, refactor this to make it
        // testable and throw plenty of tests at this...

        if(state.mouseTop >= state.pageOffset.top && state.mouseTop <= state.pageOffset.bottom) {

            // make sure the current mouse position is within a page.

            let percentage = (state.mousePageY / state.pageOffset.height) * 100;

            console.log("percentage: ", percentage);

            let pageNum = this.controller.getPageNum(state.pageElement);
            this.controller.erasePagemark(pageNum);
            await this.controller.createPagemark(pageNum, {percentage});

        } else {
            console.log("Mouse click was outside of page.")
        }

    }

    /**
     * Get the state of the pointer.
     */
    getPointerState(event) {

        let state = {
            error: null,
            pageElement: null,
            textLayerElement: null,
            viewport: null,
            pageOffset: null,
            mouseTop: null,
            mousePageY: null

        };

        state.pageElement = Elements.untilRoot(event.target, ".page");

        if(! state.pageElement) {
            state.error = "Not within a pageElement";
            return state;
        }

        state.textLayerElement = state.pageElement.querySelector(".textLayer");

        if(!state.textLayerElement) {
            state.error = "No text layer";
            return state;
        }

        state.viewport = document.getElementById("viewerContainer");

        state.pageOffset = OffsetCalculator.calculate(state.textLayerElement, state.viewport.parentElement);

        // this is lame.. this is for the border padding.  I don't like hard coding it.
        state.pageOffset.top += BORDER_PADDING;

        // manually adjust the offsets with correct jquery data.
        state.pageOffset.height = $(state.textLayerElement).height();
        state.pageOffset.bottom = state.pageOffset.top + state.pageOffset.height;

        state.mouseTop = event.pageY + state.viewport.scrollTop;

        if(DocFormats.getFormat() === "html") {
            // the html viewer doesn't need page offset factored in since it
            // is within an iframe.
            state.mousePageY = state.mouseTop;
        } else {
            state.mousePageY = state.mouseTop - state.pageOffset.top;
        }

        return state;

    }

};

module.exports.PagemarkCoverageEventListener = PagemarkCoverageEventListener;
