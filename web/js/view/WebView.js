const {Delegator, Styles, Elements, forDict} = require("../utils.js");
const {DocMetaDescriber} = require("../metadata/DocMetaDescriber");
const {DocFormatFactory} = require("../docformat/DocFormatFactory");
const {CompositePagemarkComponent} = require("../pagemarks/view/renderer/CompositePagemarkComponent");
const {MainPagemarkComponent} = require("../pagemarks/view/renderer/MainPagemarkComponent");
const {ThumbnailPagemarkComponent} = require("../pagemarks/view/renderer/ThumbnailPagemarkComponent");
const {Preconditions} = require("../Preconditions");
const {View} = require("./View.js");
const {BoxController} = require("../pagemarks/controller/interact/BoxController");

class WebView extends View {

    /**
     *
     * @param model {Model}
     */
    constructor(model) {
        super(model);

        /**
         * The currently defined renderer for pagemarks.
         */
        this.pagemarkComponent = null;
        this.docFormat = DocFormatFactory.getInstance();

        this.pagemarkBoxController = new BoxController(this.pagemarkMoved);

    }

    pagemarkMoved(boxMoveEvent) {
        console.log("Box moved: ", boxMoveEvent);
    }

    start() {

        this.model.registerListenerForCreatePagemark(this.onCreatePagemark.bind(this));
        this.model.registerListenerForErasePagemark(this.onErasePagemark.bind(this));
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));


        return this;

    }

    updateProgress() {

        let perc = this.computeProgress(this.model.docMeta);

        console.log("Percentage is now: " + perc);

        document.querySelector("#polar-progress progress").value = perc;

        // now update the description of the doc at the bottom.

        let description = DocMetaDescriber.describe(this.model.docMeta);

        let docOverview = document.querySelector("#polar-doc-overview");

        if(docOverview) {
            docOverview.textContent = description;
        }

    }

    computeProgress(docMeta) {

        // I think this is an issue of being async maybel?

        let total = 0;

        forDict(docMeta.pageMetas, function (key, pageMeta) {

            forDict(pageMeta.pagemarks, function (column, pagemark) {

                total += pagemark.percentage;

            }.bind(this));

        }.bind(this));

        let perc = total / (docMeta.docInfo.nrPages * 100);

        return perc;
    }

    /**
     * Setup a document once we detect that a new one has been loaded.
     */
    onDocumentLoaded() {

        console.log("WebView.onDocumentLoaded: ", this.model.docMeta);

        let pagemarkComponentDelegates = [
            new MainPagemarkComponent(this),
        ];

        if (this.docFormat.supportThumbnails()) {
            // only support rendering thumbnails for documents that have thumbnail
            // support.
            pagemarkComponentDelegates.push(new ThumbnailPagemarkComponent(this));
        } else {
            console.warn("Thumbnails not enabled.");
        }

        this.pagemarkComponent = new CompositePagemarkComponent(this, pagemarkComponentDelegates);
        this.pagemarkComponent.setup();

        this.updateProgress();

    }

    onCreatePagemark(pagemarkEvent) {
        console.log("WebView.onCreatePagemark");

        console.log("Creating pagemark on page: " + pagemarkEvent.pageNum);

        this.pagemarkComponent.create(pagemarkEvent.pageNum, pagemarkEvent.pagemark);
        this.updateProgress();

    }

    onErasePagemark(pagemarkEvent) {
        console.log("WebView.onErasePagemark");

        this.pagemarkComponent.erase(pagemarkEvent.pageNum);
        this.updateProgress();

    }

    async recreatePagemarksFromPagemarks(pageElement, options) {

        let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);

        Preconditions.assertNotNull(pageNum, "pageNum");
        Preconditions.assertNumber(pageNum, "pageNum");

        if(pageNum <= 0) {
            throw new Error("Page numbers must be >= 1: " + pageNum);
        }

        let docMeta = this.model.docMeta;

        let pageMeta = docMeta.pageMetas[pageNum];

        Preconditions.assertNotNull(pageMeta, "pageMeta");

        forDict(pageMeta.pagemarks, (column, pagemark) => {

            console.log("Creating pagemarks for page: " + pageNum);

            let recreatePagemarkOptions = Object.assign({}, options);

            recreatePagemarkOptions.pagemark = pagemark;

            this.recreatePagemark(pageElement, recreatePagemarkOptions);

        });

        //this.recreatePagemark(pageElement);

    }

    recreatePagemark(pageElement, options) {

        if(! options.pagemark) {
            throw new Error("No pagemark.");
        }

        if( pageElement.querySelector(".pagemark") != null &&
            pageElement.querySelector(".canvasWrapper") != null &&
            pageElement.querySelector(".textLayer") != null ) {

            // Do not recreate the pagemark if:
            //   - we have a .pagemark element
            //   - we also have a .canvasWrapper and a .textLayer

            return;

        }

        // make sure to first remove all the existing pagemarks if there
        // are any
        this.erasePagemarks(pageElement);

        // we're done all the canvas and text nodes... so place the pagemark
        // back in again.

        this.createPagemark(pageElement, options);

    }

    /**
     * Create a pagemark on the given page which marks it read.
     * @param pageElement {HTMLElement}
     * @param options {Object}
     */
    createPagemark(pageElement, options = {}) {

        // FIXME: migrate this to a proper view that listens to the DocMeta
        // change

        // TODO: this code is ugly, can't be tested, etc.
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
            options.templateElement = pageElement;
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
        this.pagemarkBoxController.register(pagemarkElement);

    }

    redrawPagemark() {

    }

    erasePagemarks(pageElement) {

        if(!pageElement) {
            throw new Error("No pageElement");
        }

        console.log("Erasing pagemarks...");

        let pagemarks = pageElement.querySelectorAll(".pagemark");

        pagemarks.forEach(function (pagemark) {
            pagemark.parentElement.removeChild(pagemark);
            console.log("Erased pagemark.");
        });

        console.log("Erasing pagemarks...done");

    }

}

module.exports.WebView = WebView;
