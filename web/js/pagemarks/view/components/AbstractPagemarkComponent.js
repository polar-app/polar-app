const {Component} = require("../../../components/Component");
const {DocFormatFactory} = require("../../../docformat/DocFormatFactory");
const {Styles} = require("../../../util/Styles");
const {Preconditions} = require("../../../Preconditions");

class AbstractPagemarkComponent extends Component {

    constructor() {
        super();

        /**
         *
         * @type {DocFormat}
         */
        this.docFormat = DocFormatFactory.getInstance();

        /**
         *
         * @type {Pagemark}
         */
        this.pagemark = undefined;

        /**
         *
         * @type {AnnotationEvent}
         */
        this.annotationEvent = undefined;

        this.pagemarkBoxController = new BoxController(this.pagemarkMoved);

        /**
         *
         * The element created to represent the pagemark.
         *
         * @type {HTMLElement}
         */
        this.pagemarkElement = null;

        this.options = {
            templateElement: null,
            placementElement: null
        };

    }

    /**
     * @Override
     * @param annotationEvent {AnnotationEvent}
     */
    init(annotationEvent) {

        this.annotationEvent = annotationEvent;
        this.pagemark = annotationEvent.value;

    }

    pagemarkMoved(boxMoveEvent) {

        // TODO: actually I think this belongs in the controller... not the view
        //
        //

        // TODO: remove the pagemark, then recreate it...

        console.log("Box moved: ", boxMoveEvent);
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

        if(! this.pagemark) {
            throw new Error("Pagemark is required");
        }

        if(! this.pagemark.percentage) {
            throw new Error("Pagemark has no percentage");
        }

        let templateElement = this.options.templateElement;
        let placementElement = this.options.placementElement;

        if(! templateElement) {
            templateElement = this.annotationEvent.pageElement;
        }

        if (! placementElement) {
            // TODO: move this to the proper component
            placementElement = this.pageElement.querySelector(".canvasWrapper, .iframeWrapper");
        }

        Preconditions.assertNotNull(templateElement, "templateElement")
        Preconditions.assertNotNull(placementElement, "placementElement")

        if (this.pageElement.querySelector(this.pagemark.id)) {
            // do nothing if the current page already has a pagemark.
            console.warn("Pagemark already exists");
            return;
        }

        this.pagemarkElement = document.createElement("div");

        // set a pagemark-id in the DOM so that we can work with it when we use
        // the context menu, etc.
        this.pagemarkElement.setAttribute("id", this.pagemark.id);
        this.pagemarkElement.setAttribute("data-pagemark-id", this.pagemark.id);

        // make sure we have a reliable CSS classname to work with.
        this.pagemarkElement.className="pagemark annotation";

        //pagemark.style.backgroundColor="rgb(198, 198, 198)";
        this.pagemarkElement.style.backgroundColor="#00CCFF";
        this.pagemarkElement.style.opacity="0.3";

        this.pagemarkElement.style.position="absolute";

        // FIXME: this needs to be a function of the PlacedPagemarkCalculator
        this.pagemarkElement.style.left = templateElement.offsetLeft;

        // FIXME: this needs to be a function of the PlacedPagemarkCalculator
        this.pagemarkElement.style.top = templateElement.offsetTop;

        // FIXME: this needs to be a function of the PlacedPagemarkCalculator
        this.pagemarkElement.style.width = templateElement.style.width;

        // FIXME: this needs to be a function of the PlacedPagemarkCalculator
        let height = Styles.parsePX(templateElement.style.height);

        if(!height) {
            // FIXME: this needs to be a function of the PlacedPagemarkCalculator
            height = templateElement.offsetHeight;
        }

        // read the percentage coverage from the pagemark and adjust the height
        // to reflect the portion we've actually read.
        // FIXME: this needs to be a function of the PlacedPagemarkCalculator
        height = height * (this.pagemark.percentage / 100);

        this.pagemarkElement.style.height = `${height}px`;

        this.pagemarkElement.style.zIndex = '1';

        if(!this.pagemarkElement.style.width) {
            throw new Error("Could not determine width");
        }

        placementElement.parentElement.insertBefore(this.pagemarkElement, placementElement);

        // TODO: this enables resize but we don't yet support updating the
        // pagemark data itself.  We're probably going to have to implement
        // mutation listeners there.

        console.log("Creating box controller for pagemarkElement: ", this.pagemarkElement);
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
