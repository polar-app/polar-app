import {ActiveSelection} from '../../ui/popup/ActiveSelections';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';
import {HighlightColor} from '../../metadata/HighlightColor';

export interface HighlightCreatedEvent {
    readonly activeSelection: ActiveSelection;
    readonly highlightColor: HighlightColor;
    readonly pageNum: number;
    readonly annotationDescriptor?: AnnotationDescriptor;
}
