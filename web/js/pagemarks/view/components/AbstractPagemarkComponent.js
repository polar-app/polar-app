const {Component} = require("../../../components/Component");
const {DocFormatFactory} = require("../../../docformat/DocFormatFactory");


class AbstractPagemarkComponent extends Component {

    constructor() {
        super();

        // FIXME: this needs to be refactored so that the EVENT is just stored
        // and the event is an AnnotationEvent which already has docMeta,
        // pageMeta, pageNum, and possibly pageElement attributes and shared
        // with TextHighlightModel and PagemarkModel and we just keep a reference
        // to annotationEvent which has all the fields we need.

        /**
         *
         * @type {DocFormat}
         */
        this.docFormat = DocFormatFactory.getInstance();

        /**
         *
         * @type {DocMeta}
         */
        this.docMeta = undefined;

        /**
         *
         * @type {TextHighlight}
         */
        this.textHighlight = undefined;

        /**
         *
         * @type {PageMeta}
         */
        this.pageMeta = undefined;

        /**
         * The page we're working with.
         *
         * @type {number}
         */
        this.pageNum = undefined;

        /**
         * The .page we're working with.
         *
         * @type {HTMLElement}
         */
        this.pageElement = undefined;

    }

    /**
     * @Override
     * @param componentEvent
     */
    init(componentEvent) {

        this.docMeta = componentEvent.docMeta;
        this.textHighlight = componentEvent.textHighlight;
        this.pageMeta = componentEvent.pageMeta;

        this.pageNum = this.pageMeta.pageInfo.num;
        this.pageElement = this.docFormat.getPageElementFromPageNum(this.pageNum);

    }

    /**
     * @Override
     *
     */
    render() {

        //
        // - the options building can't be reliably tested
        //
        // - there are too many ways to compute the options
        //
        // - we PLACE the element as part of this function.  Have a secondary
        //   way to just CREATE the element so that we can test the settings
        //   properly.

        if(! options.pagemark) {
            throw new Error("Pagemark is required");
        }

        if(! options.pagemark.percentage) {
            throw new Error("Pagemark has no percentage");
        }

        if(! options.zIndex)
            options.zIndex = 1;

        if(! options.templateElement) {
            options.templateElement = this.pageElement;
        }

        if (! options.placementElement) {
            // TODO: move this to the object dealing with pages only.
            options.placementElement = pageElement.querySelector(".canvasWrapper, .iframeWrapper");
        }

        if(! options.templateElement) {
            throw new Error("No templateElement");
        }

        if(! options.placementElement) {
            throw new Error("No placementElement");
        }

        if (pageElement.querySelector(".pagemark")) {
            // do nothing if the current page already has a pagemark.
            console.warn("Pagemark already exists");
            return;
        }

        let pagemarkElement = document.createElement("div");

        // set a pagemark-id in the DOM so that we can work with it when we use
        // the context menu, etc.
        pagemarkElement.setAttribute("id", options.pagemark.id);
        pagemarkElement.setAttribute("data-pagemark-id", options.pagemark.id);

        // make sure we have a reliable CSS classname to work with.
        pagemarkElement.className="pagemark annotation";

        //pagemark.style.backgroundColor="rgb(198, 198, 198)";
        pagemarkElement.style.backgroundColor="#00CCFF";
        pagemarkElement.style.opacity="0.3";

        pagemarkElement.style.position="absolute";

        let usePlacedPagemark = true;

        // FIXME: this needs to be a function of the PlacedPagemarkCalculator
        pagemarkElement.style.left = options.templateElement.offsetLeft;

        // FIXME: this needs to be a function of the PlacedPagemarkCalculator
        pagemarkElement.style.top = options.templateElement.offsetTop;

        // FIXME: this needs to be a function of the PlacedPagemarkCalculator
        pagemarkElement.style.width = options.templateElement.style.width;

        // FIXME: this needs to be a function of the PlacedPagemarkCalculator
        let height = Styles.parsePixels(options.templateElement.style.height);

        if(!height) {
            // FIXME: this needs to be a function of the PlacedPagemarkCalculator
            height = options.templateElement.offsetHeight;
        }

        // read the percentage coverage from the pagemark and adjust the height
        // to reflect the portion we've actually read.
        // FIXME: this needs to be a function of the PlacedPagemarkCalculator
        height = height * (options.pagemark.percentage / 100);

        pagemarkElement.style.height = `${height}px`;

        pagemarkElement.style.zIndex = `${options.zIndex}`;

        if(!pagemarkElement.style.width) {
            throw new Error("Could not determine width");
        }

        options.placementElement.parentElement.insertBefore(pagemarkElement, options.placementElement);

        // TODO: this enables resize but we don't yet support updating the
        // pagemark data itself.  We're probably going to have to implement
        // mutation listeners there.

        console.log("Creating box controller for pagemarkElement: ", pagemarkElement);
        this.pagemarkBoxController.register(this.pagemarkElement);

    }

    /**
     * @Override
     * @returns {*}
     */
    destroy() {
        this.pagemarkBoxController.unregister(this.pagemarkElement);
    }

}

module.exports.AbstractPagemarkComponent = AbstractPagemarkComponent;