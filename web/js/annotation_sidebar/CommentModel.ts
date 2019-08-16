import {DocMetaModel} from '../metadata/DocMetaModel';
import {DocMeta, IDocMeta} from '../metadata/DocMeta';
import {AnnotationEventListener} from '../annotations/components/AnnotationEventListener';
import {PageMetas} from '../metadata/PageMetas';

export class CommentModel extends DocMetaModel {

    public registerListener(docMeta: IDocMeta, annotationEventListener: AnnotationEventListener) {
        PageMetas.createModel(docMeta, "comments", annotationEventListener);
        return annotationEventListener;
    }

}
