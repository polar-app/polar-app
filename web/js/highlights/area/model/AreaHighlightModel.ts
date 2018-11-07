import {DocMeta} from '../../../metadata/DocMeta';
import {DocMetaModel} from '../../../metadata/DocMetaModel';
import {PageMetas} from '../../../metadata/PageMetas';
import {AnnotationEventListener} from '../../../annotations/components/AnnotationEventListener';


export class AreaHighlightModel extends DocMetaModel {

    public registerListener(docMeta: DocMeta, annotationEventListener: AnnotationEventListener) {
        PageMetas.createModel(docMeta, "areaHighlights", annotationEventListener);
        return annotationEventListener;
    }

}

