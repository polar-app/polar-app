import {DocMeta} from '../../../metadata/DocMeta';
import {DocMetaModel} from '../../../metadata/DocMetaModel';
import {PageMetas} from '../../../metadata/PageMetas';
import {AnnotationEvent} from '../../../annotations/components/AnnotationEvent';

export class TextHighlightModel extends DocMetaModel {

    public registerListener(docMeta: DocMeta, callback: (annotationEvent: AnnotationEvent) => void) {
        PageMetas.createModel(docMeta, "textHighlights", callback);
    }

}
