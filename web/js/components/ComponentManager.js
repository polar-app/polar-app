const {PageRedrawHandler} = require("../PageRedrawHandler");
const {DocFormatFactory} = require("../docformat/DocFormatFactory");
const {MutationState} = require("../proxies/MutationState");
const log = require("../logger/Logger").create();

class ComponentManager {

    /**
     *
     * @param model {Model}
     * @param createComponent {Function<Component>}
     * @param createDocMetaModel {Function<DocMetaModel>}
     */
    constructor(model, createComponent, createDocMetaModel) {

        this.model = model;
        this.docFormat = DocFormatFactory.getInstance();
        this.createComponent = createComponent;
        this.createDocMetaModel = createDocMetaModel;

        /**
         * A map of components based on their ID.
         *
         * @type {Object<String,ComponentEntry>}
         */
        this.components = {};

    }

    start() {
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
    }

    onDocumentLoaded(documentLoadedEvent) {

        log.info("onDocumentLoaded");

        let docMetaModel = this.createDocMetaModel();

        // Listen for changes from the model as objects are PRESENT or ABSENT
        // for the specific objects we're interested in and then call
        // onComponentEvent so that we can render/destroy the component and
        // and change it on page events.

        docMetaModel.registerListener(documentLoadedEvent.docMeta, this.onComponentEvent.bind(this));

    }

    onComponentEvent(componentEvent) {

        log.info("onComponentEvent: ", componentEvent);

        let pageNum = componentEvent.pageMeta.pageInfo.num;

        if(componentEvent.mutationState === MutationState.PRESENT) {

            log.info("PRESENT");

            let pageElement = this.docFormat.getPageElementFromPageNum(pageNum);

            // create the component and call render on it...

            let component = this.createComponent();

            component.init(componentEvent);

            let callback = () => {
                component.render();
            };

            // draw it manually the first time.
            callback();

            // then let the redraw handler do it after this.
            let pageRedrawHandler = new PageRedrawHandler(pageElement);
            pageRedrawHandler.register(callback);

            this.components[componentEvent.id] = new ComponentEntry(pageRedrawHandler, component);

        } else if(componentEvent.mutationState === MutationState.ABSENT) {

            log.info("ABSENT");

            let componentEntry = this.components[componentEvent.id];
            componentEntry.pageRedrawHandler.unregister();
            componentEntry.component.destroy();

            delete this.components[componentEvent.id];

        }

    }

}

class ComponentEntry {

    /**
     *
     * @param pageRedrawHandler {PageRedrawHandler}
     * @param component {Component}
     */
    constructor(pageRedrawHandler, component) {
        this.pageRedrawHandler = pageRedrawHandler;
        this.component = component;
    }

}

module.exports.ComponentManager = ComponentManager;
