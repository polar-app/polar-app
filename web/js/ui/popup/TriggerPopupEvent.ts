import {Point} from '../../Point';
import {Offset} from '../../util/Offset';

export interface TriggerPopupEvent {

    readonly point: Point;

    readonly offset?: Offset;

    /**
     * The page number on which this popup should be placed.
     */
    readonly pageNum: number;

}
