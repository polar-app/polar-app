import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';

export interface CommentCreatedEvent {

    readonly text: string;
    readonly type: CommentType;
    readonly pageNum: number;
    readonly annotationDescriptor?: AnnotationDescriptor;

}

export type CommentType = 'text' | 'html';
