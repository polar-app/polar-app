import {DocMeta} from '../../../metadata/DocMeta';
import {DocMetaModel} from '../../../metadata/DocMetaModel';
import {PageMetas} from '../../../metadata/PageMetas';
import {AnnotationEventListener} from '../../../annotations/components/AnnotationEventListener';
import {IDocMeta} from "../../../metadata/IDocMeta";


export class AreaHighlightModel extends DocMetaModel {

    public registerListener(docMeta: IDocMeta, annotationEventListener: AnnotationEventListener) {
        PageMetas.createModel(docMeta, "areaHighlights", annotationEventListener);
        return annotationEventListener;
    }

}

