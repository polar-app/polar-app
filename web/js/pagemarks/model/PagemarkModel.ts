import {DocMeta, IDocMeta} from '../../metadata/DocMeta';
import {DocMetaModel} from '../../metadata/DocMetaModel';
import {PageMetas} from '../../metadata/PageMetas';
import {AnnotationEvent} from '../../annotations/components/AnnotationEvent';

/**
 *
 */
export class PagemarkModel extends DocMetaModel {

    public registerListener(docMeta: IDocMeta, callback: (componentEvent: AnnotationEvent) => void) {
        PageMetas.createModel(docMeta, "pagemarks", callback);
    }

}
