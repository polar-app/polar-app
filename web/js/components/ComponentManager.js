const {PageRedrawHandler} = require("../PageRedrawHandler");
const {DocFormatFactory} = require("../docformat/DocFormatFactory");
const {MutationState} = require("../proxies/MutationState");
const {Preconditions} = require("../Preconditions");

const log = require("../logger/Logger").create();

class ComponentManager {

    /**
     *
     * @param model {Model}
     * @param containerProvider {ContainerProvider}
     * @param createComponent {Function<Component>}
     * @param createDocMetaModel {Function<DocMetaModel>}
     */
    constructor(model, containerProvider, createComponent, createDocMetaModel) {

        this.model = model;

        /**
         * @type {ContainerProvider}
         */
        this.containerProvider = containerProvider;

        this.docFormat = DocFormatFactory.getInstance();

        this.createComponent = createComponent;

        this.createDocMetaModel = createDocMetaModel;

        /**
         * A map of components based on their ID.
         *
         * @type {Object<String,ComponentEntry>}
         */
        this.components = {};

        /**
         *
         * @return {Object<number,Container>}
         */
        this.containers = {};

    }

    start() {
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
    }

    onDocumentLoaded(documentLoadedEvent) {

        log.info("onDocumentLoaded: ", documentLoadedEvent.fingerprint);

        let docMetaModel = this.createDocMetaModel();

        this.containers = this.containerProvider.getContainers();

        log.info("Working with containers: ", this.containers);

        // Listen for changes from the model as objects are PRESENT or ABSENT
        // for the specific objects we're interested in and then call
        // onComponentEvent so that we can render/destroy the component and
        // and change it on page events.

        docMetaModel.registerListener(documentLoadedEvent.docMeta, this.onComponentEvent.bind(this));

    }

    onComponentEvent(componentEvent) {

        // TODO: I think it would be better to build up pageNum and pageElement
        // within AnnotationEvent - not here.  This should just be a ComponentEvent
        // and not know anything about annotations.

        log.info("onComponentEvent: ", componentEvent);

        let containerID = componentEvent.pageMeta.pageInfo.num;

        Preconditions.assertNumber(containerID, "containerID");

        Preconditions.assertNumber(containerID, "containerID");

        if(componentEvent.mutationState === MutationState.PRESENT) {

            log.info("PRESENT");

            let container = this.containers[containerID];

            if(! container) {
                throw new Error("No container for containerID: " + containerID);
            }

            componentEvent.container = container;

            //let container = this.cont

            // create the component and call render on it...

            let component = this.createComponent();

            component.init(componentEvent);

            // FIXME: register the component with the container and ONLY call
            // he callback if and when the container is visible.

            let callback = (containerLifecycleState) => {

                if(containerLifecycleState.visible) {

                    // now render the component on screen.
                    component.render();

                } else {
                    component.destroy();
                }

            };

            let containerLifecycleListener
                = this.containerProvider.createContainerLifecycleListener(container);

            containerLifecycleListener.register(callback);

            let containerState = containerLifecycleListener.getState();

            if(containerState.visible) {
                // draw it manually the first time.
                callback(containerState);
            }

            this.components[componentEvent.id] = new ComponentEntry(containerLifecycleListener, component);

        } else if(componentEvent.mutationState === MutationState.ABSENT) {

            log.info("ABSENT");

            let componentEntry = this.components[componentEvent.id];

            if(componentEntry) {

                componentEntry.containerLifecycleListener.unregister();
                componentEntry.component.destroy();

                log.info("Destroyed component: " + componentEvent.id);

                delete this.components[componentEvent.id];

            } else {
                log.warn("No component entry for: " + componentEvent.id);
            }

        }

    }

}

class ComponentEntry {

    /**
     *
     * @param containerLifecycleListener {ContainerLifecycleListener}
     * @param component {Component}
     */
    constructor(containerLifecycleListener, component) {
        this.containerLifecycleListener = containerLifecycleListener;
        this.component = component;
    }

}

module.exports.ComponentManager = ComponentManager;
