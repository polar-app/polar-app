import {DocDescriptor} from '../metadata/DocDescriptor';
import {Point} from '../Point';
import {Points} from './Points';
import {ContextMenuType} from './ContextMenuType';
import {MatchingSelector} from './MatchingSelector';

export class TriggerEvent {

    /**
     * The point on the screen where the context menu was requested.  This
     * is just a point with x,y positions.
     *
     * @type {null}
     */
    public readonly point: Point;

    public readonly points: Points;

    /**
     * The page number on which this event was triggered.
     */
    public readonly pageNum: number;

    /**
     * The type of context menus to create based on what the user is clicking.
     */
    public readonly contextMenuTypes: ContextMenuType[];

    /**
     * A more complex data structure with the selectors and metadata
     * about the annotations that were selected.
     */
    public readonly matchingSelectors: {[key: string]: MatchingSelector};

    /**
     * Basic metadata about the document with which we're interacting.
     */
    public readonly docDescriptor: DocDescriptor;

    constructor(point: Point,
                points: Points,
                pageNum: number,
                contextMenuTypes: ContextMenuType[],
                matchingSelectors: {[key: string]: MatchingSelector},
                docDescriptor: DocDescriptor) {

        this.point = point;
        this.points = points;
        this.pageNum = pageNum;
        this.contextMenuTypes = contextMenuTypes;
        this.matchingSelectors = matchingSelectors;
        this.docDescriptor = docDescriptor;

    }

    public static create(opts: any): TriggerEvent {
        let result = Object.create(TriggerEvent.prototype);
        result = Object.assign(result, opts);
        return result;
    }

}
