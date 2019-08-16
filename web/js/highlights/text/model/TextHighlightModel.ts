import {DocMeta} from '../../../metadata/DocMeta';
import {DocMetaModel} from '../../../metadata/DocMetaModel';
import {PageMetas} from '../../../metadata/PageMetas';
import {AnnotationEventListener} from '../../../annotations/components/AnnotationEventListener';

export class TextHighlightModel extends DocMetaModel {

    public registerListener(docMeta: IDocMeta, annotationEventListener: AnnotationEventListener) {
        PageMetas.createModel(docMeta, "textHighlights", annotationEventListener);
        return annotationEventListener;
    }

}
