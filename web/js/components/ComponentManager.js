"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DocFormatFactory_1 = require("../docformat/DocFormatFactory");
const Logger_1 = require("../logger/Logger");
const Preconditions_1 = require("../Preconditions");
const MutationState_1 = require("../proxies/MutationState");
const log = Logger_1.Logger.create();
class ComponentManager {
    constructor(model, containerProvider, createComponent, createDocMetaModel) {
        this.containers = {};
        this.components = {};
        this.model = model;
        this.containerProvider = containerProvider;
        this.docFormat = DocFormatFactory_1.DocFormatFactory.getInstance();
        this.createComponent = createComponent;
        this.createDocMetaModel = createDocMetaModel;
    }
    start() {
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
    }
    onDocumentLoaded(documentLoadedEvent) {
        log.debug("onDocumentLoaded: ", documentLoadedEvent.fingerprint);
        let docMetaModel = this.createDocMetaModel();
        this.containers = this.containerProvider.getContainers();
        log.debug("Working with containers: ", this.containers);
        docMetaModel.registerListener(documentLoadedEvent.docMeta, this.onComponentEvent.bind(this));
    }
    onComponentEvent(componentEvent) {
        log.debug("onComponentEvent: ", componentEvent);
        let containerID = componentEvent.pageMeta.pageInfo.num;
        Preconditions_1.Preconditions.assertNumber(containerID, "containerID");
        Preconditions_1.Preconditions.assertNumber(containerID, "containerID");
        if (componentEvent.mutationState === MutationState_1.MutationState.PRESENT) {
            log.debug("PRESENT");
            let container = this.containers[containerID];
            if (!container) {
                throw new Error("No container for containerID: " + containerID);
            }
            componentEvent.container = container;
            let component = this.createComponent();
            component.init(componentEvent);
            let callback = (containerLifecycleState) => {
                if (containerLifecycleState.visible) {
                    component.render();
                }
                else {
                    component.destroy();
                }
            };
            let containerLifecycleListener = this.containerProvider.createContainerLifecycleListener(container);
            containerLifecycleListener.register(callback);
            let containerState = containerLifecycleListener.getState();
            if (containerState.visible) {
                callback(containerState);
            }
            this.components[componentEvent.id] = new ComponentEntry(containerLifecycleListener, component);
        }
        else if (componentEvent.mutationState === MutationState_1.MutationState.ABSENT) {
            log.debug("ABSENT");
            let componentEntry = this.components[componentEvent.id];
            if (componentEntry) {
                componentEntry.containerLifecycleListener.unregister();
                componentEntry.component.destroy();
                log.debug("Destroyed component: " + componentEvent.id);
                delete this.components[componentEvent.id];
            }
            else {
                log.warn("No component entry for: " + componentEvent.id);
            }
        }
    }
}
exports.ComponentManager = ComponentManager;
class ComponentEntry {
    constructor(containerLifecycleListener, component) {
        this.containerLifecycleListener = containerLifecycleListener;
        this.component = component;
    }
}
exports.ComponentEntry = ComponentEntry;
//# sourceMappingURL=ComponentManager.js.map