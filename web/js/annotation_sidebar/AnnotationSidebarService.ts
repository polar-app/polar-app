import {DocumentLoadedEvent, Model} from '../model/Model';
import {AnnotationSidebars} from './AnnotationSidebars';
import {Logger} from '../logger/Logger';
import {Splitter} from '../ui/splitter/Splitter';

const log = Logger.create();

export class AnnotationSidebarService {

    private readonly model: Model;

    private splitter?: Splitter;

    public constructor(model: Model) {
        this.model = model;
    }

    public start() {

        this.model.registerListenerForDocumentLoaded(event => this.onDocumentLoaded(event));

        window.addEventListener("message", event => this.onMessageReceived(event), false);

        return this;

    }

    private onDocumentLoaded(event: DocumentLoadedEvent) {
        log.debug("Creating annotation sidebar");
        this.splitter = AnnotationSidebars.create(event.docMeta);
    }

    private onMessageReceived(event: any) {

        log.info("Received message: ", event);

        switch (event.data.type) {

            case "toggle-annotation-sidebar":
                this.toggleAnnotationSidebar();
                break;

        }

    }

    private toggleAnnotationSidebar() {
        this.splitter!.toggle();
    }

}
