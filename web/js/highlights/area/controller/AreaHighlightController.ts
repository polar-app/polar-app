import {Model} from '../../../model/Model';
import {DocFormat} from '../../../docformat/DocFormat';
import {Logger} from '../../../logger/Logger';
import {Preconditions} from '../../../Preconditions';
import {DocFormatFactory} from '../../../docformat/DocFormatFactory';
import {ContextMenuLocation} from '../../../contextmenu/ContextMenuLocation';
import {AnnotationRects} from '../../../metadata/AnnotationRects';
import {AreaHighlights} from '../../../metadata/AreaHighlights';
import {AnnotationPointers} from '../../../annotations/AnnotationPointers';
import {TriggerEvent} from '../../../contextmenu/TriggerEvent';


const log = Logger.create();

export class AreaHighlightController {

    private readonly model: Model;

    private readonly docFormat: DocFormat;

    constructor(model: Model) {
        this.model = Preconditions.assertNotNull(model, "model");
        this.docFormat = DocFormatFactory.getInstance();

        // ipcRenderer.on('context-menu-command', (event: Electron.Event, arg: any) => {
        //
        //     switch (arg.command) {
        //
        //         case "delete-area-highlight":
        //             this.onDeleteAreaHighlight(event);
        //             break;
        //
        //         default:
        //             console.warn("Unhandled command: " + arg.command);
        //             break;
        //     }
        //
        // });

    }

    onDocumentLoaded() {
        log.info("onDocumentLoaded: ", this.model.docMeta);
    }

    start() {

        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    onMessageReceived(event: MessageEvent) {

        if (event.data && event.data.type === "create-area-highlight") {
            this.onCreateAreaHighlight(event.data);
        }

        if (event.data && event.data.type === "delete-area-highlight") {
            this.onDeleteAreaHighlight(event.data);
        }

    }

    /**
     *
     */
    onCreateAreaHighlight(contextMenuLocation: ContextMenuLocation) {

        log.info("Creating area highlight: ", contextMenuLocation);

        let annotationRect = AnnotationRects.createFromEvent(contextMenuLocation);

        log.info("annotationRect", annotationRect);

        let areaHighlight = AreaHighlights.create({rect: annotationRect});

        log.info("areaHighlight", areaHighlight);

        let docMeta = this.model.docMeta;
        let pageMeta = docMeta.getPageMeta(contextMenuLocation.pageNum);

        pageMeta.areaHighlights[areaHighlight.id] = areaHighlight;

    }

    onDeleteAreaHighlight(triggerEvent: TriggerEvent) {

        let annotationPointers
            = AnnotationPointers.toAnnotationPointers(".area-highlight", triggerEvent);

        annotationPointers.forEach(annotationPointer => {
            let pageMeta = this.model.docMeta.getPageMeta(annotationPointer.pageNum);
            delete pageMeta.areaHighlights[annotationPointer.id];
        });

    }

}
