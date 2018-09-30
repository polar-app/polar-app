import {ActiveSelection} from '../../ui/popup/ActiveSelections';
import {HighlightColor} from '../../metadata/BaseHighlight';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';

export interface HighlightCreatedEvent {
    readonly activeSelection: ActiveSelection;
    readonly highlightColor: HighlightColor;
    readonly pageNum: number;
    readonly annotationDescriptor?: AnnotationDescriptor;
}
