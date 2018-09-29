import {Point} from '../../Point';


/**
 * Created when we are attempting to create/cancel a comment.
 */
export interface CommentInputEvent {
    readonly point: Point;
    readonly pageNum: number;
    readonly type: 'create' | 'cancel';
}

