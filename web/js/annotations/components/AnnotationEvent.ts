import {TraceEvent} from '../../proxies/TraceEvent';
import {Preconditions} from '../../Preconditions';
import {PageMeta} from '../../metadata/PageMeta';
import {DocMeta} from '../../metadata/DocMeta';
import {Container} from '../../components/containers/Container';

export class AnnotationEvent extends TraceEvent {


    /**
     * The ID for this annotation.
     *
     * @type {string}
     */
    public id: string;

    /**
     *
     * @type {DocMeta}
     */
    public docMeta: DocMeta;

    /**
     *
     * @type {PageMeta}
     */
    public pageMeta: PageMeta;

    /**
     * The page we're working with.
     *
     * @type {number}
     */
    public pageNum: number;

    /**
     * The raw TraceEvent for this annotation.
     *
     * @type {TraceEvent}
     */
    public traceEvent: TraceEvent;

    /**
     * The container which holds this annotation.
     *
     * @type {Container}
     */
    public container: Container;

    constructor(opts: any = {}) {

        super(opts);

        this.id = opts.id;
        this.docMeta = opts.docMeta;
        this.pageMeta = opts.pageMeta;
        this.pageNum = opts.pageNum;
        this.traceEvent = opts.traceEvent;
        this.container = opts.container;

        if (this.value) {
            this.id = this.value.id;
        } else {
            this.id = this.previousValue.id;
        }

        Preconditions.assertPresent(this.pageMeta, "pageMeta");

    }

}
