import {Point} from '../../Point';
import {Offset} from '../../util/Offset';

export interface TriggerPopupEvent {

    readonly point: Point;

    readonly offset?: Offset;

}
