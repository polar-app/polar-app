import {Point} from '../../Point';


/**
 * Created when we are attempting to create/cancel a comment.
 */
export interface CommentEvent {
    readonly point: Point;
    readonly type: 'create' | 'cancel';
}

