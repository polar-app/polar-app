import {Point} from '../../Point';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';


/**
 * Created when we are attempting to create/cancel a comment.
 */
export interface CommentInputEvent {
    readonly point: Point;
    readonly pageNum: number;
    readonly annotationDescriptor: AnnotationDescriptor;
    readonly type: 'create' | 'cancel';
}

