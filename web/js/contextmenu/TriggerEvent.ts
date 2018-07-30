import {DocDescriptor} from '../metadata/DocDescriptor';
import {Point} from '../Point';
import {Points} from './Points';

export class TriggerEvent {

    /**
     * The point on the screen where the context menu was requested.  This
     * is just a point with x,y positions.
     *
     * @type {null}
     */
    private point: Point;

    private points: Points;

    /**
     * The page number on which this event was triggered.
     */
    private pageNum: number;

    /**
     * The type of context menus to create based on what the user is clicking.
     */
    private contextMenuTypes: any;

    /**
     * A more complex data structure with the selectors and metadata
     * about the annotations that were selected.
     */
    private matchingSelectors: any;

    /**
     * Basic metadata about the document with which we're interacting.
     */
    private docDescriptor: DocDescriptor;

    constructor(point: Point, points: Points, pageNum: number, contextMenuTypes: any, matchingSelectors: any, docDescriptor: DocDescriptor) {
        this.point = point;
        this.points = points;
        this.pageNum = pageNum;
        this.contextMenuTypes = contextMenuTypes;
        this.matchingSelectors = matchingSelectors;
        this.docDescriptor = docDescriptor;
    }

    public static create(opts: any) {
        let result = Object.create(TriggerEvent.prototype);
        result = Object.assign(result, opts);
        return result;
    }

}
