import {DocMetaModel} from '../metadata/DocMetaModel';
import {DocMeta} from '../metadata/DocMeta';
import {AnnotationEventListener} from '../annotations/components/AnnotationEventListener';
import {PageMetas} from '../metadata/PageMetas';
import {IDocMeta} from "../metadata/IDocMeta";

export class FlashcardModel extends DocMetaModel {

    public registerListener(docMeta: IDocMeta, annotationEventListener: AnnotationEventListener) {
        PageMetas.createModel(docMeta, "flashcards", annotationEventListener);
        return annotationEventListener;
    }

}
