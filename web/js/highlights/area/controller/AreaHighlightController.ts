import {DocumentLoadedEvent, Model} from '../../../model/Model';
import {DocFormat} from '../../../docformat/DocFormat';
import {Logger} from '../../../logger/Logger';
import {Preconditions} from '../../../Preconditions';
import {DocFormatFactory} from '../../../docformat/DocFormatFactory';
import {ContextMenuLocation} from '../../../contextmenu/ContextMenuLocation';
import {AnnotationRects} from '../../../metadata/AnnotationRects';
import {AreaHighlights} from '../../../metadata/AreaHighlights';
import {AnnotationPointers} from '../../../annotations/AnnotationPointers';
import {TriggerEvent} from '../../../contextmenu/TriggerEvent';
import {Optional} from '../../../util/ts/Optional';
import {Arrays} from '../../../util/Arrays';
import {AreaHighlightDeleteOpts} from '../../../metadata/AreaHighlights';
import {AreaHighlightRects} from '../../../metadata/AreaHighlightRects';
import {DoWriteOpts} from '../../../metadata/AreaHighlights';
import {AreaHighlight} from '../../../metadata/AreaHighlight';
import {Rects} from '../../../Rects';


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

    public start() {

        this.model.registerListenerForDocumentLoaded((event) => this.onDocumentLoaded(event));

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    private onDocumentLoaded(event: DocumentLoadedEvent) {
        log.info("onDocumentLoaded: ", event.docMeta);
    }

    private onMessageReceived(event: MessageEvent) {

        if (event.data && event.data.type === "create-area-highlight") {
            this.onCreateAreaHighlight(event.data);
        }

        if (event.data && event.data.type === "delete-area-highlight") {
            this.onDeleteAreaHighlight(event.data);
        }

    }

    private onCreateAreaHighlight(contextMenuLocation: ContextMenuLocation) {

        log.info("Creating area highlight: ", contextMenuLocation);

        const rectFromEvent = AnnotationRects.createFromEvent(contextMenuLocation);
        const annotationRect = AreaHighlights.toCorrectScale(Rects.createFromBasicRect(rectFromEvent));

        log.info("annotationRect", annotationRect);

        const areaHighlight = AreaHighlights.create({rect: annotationRect});

        log.info("areaHighlight", areaHighlight);

        const docMeta = this.model.docMeta;
        const pageMeta = docMeta.getPageMeta(contextMenuLocation.pageNum);

        pageMeta.areaHighlights[areaHighlight.id] = areaHighlight;

    }

    private onDeleteAreaHighlight(triggerEvent: TriggerEvent) {

        const annotationPointers
            = AnnotationPointers.toAnnotationPointers(".area-highlight", triggerEvent);

        const annotationPointer = Arrays.first(annotationPointers);

        if (annotationPointer) {

            const datastore = this.model.persistenceLayerProvider();
            const pageMeta = this.model.docMeta.getPageMeta(annotationPointer.pageNum);
            const areaHighlight = pageMeta.areaHighlights[annotationPointer.id];
            const {docMeta} = this.model;

            const opts: AreaHighlightDeleteOpts = {
                datastore, areaHighlight, pageMeta, docMeta
            };

            AreaHighlights.delete(opts)
                .catch(err => log.error("Unable to delete area highlight: ", err));

        }

    }

}
