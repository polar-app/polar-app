import {DocumentLoadedEvent, Model} from '../model/Model';
import {AnnotationSidebars} from './AnnotationSidebars';
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class AnnotationSidebarService {

    private readonly model: Model;

    public constructor(model: Model) {
        this.model = model;

    }

    public start() {

        this.model.registerListenerForDocumentLoaded(event => this.onDocumentLoaded(event));

        return this;

    }

    private onDocumentLoaded(event: DocumentLoadedEvent) {
        log.debug("Creating annotation sidebar");
        AnnotationSidebars.create(event.docMeta);
    }

}
