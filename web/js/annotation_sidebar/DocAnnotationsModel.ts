import {DocMetaModel} from '../metadata/DocMetaModel';
import {DocMeta} from '../metadata/DocMeta';
import {AnnotationEvent} from '../annotations/components/AnnotationEvent';
import {PageMetas} from '../metadata/PageMetas';

export class DocAnnotationsModel extends DocMetaModel {

    public registerListener(docMeta: DocMeta, callback: (annotationEvent: AnnotationEvent) => void) {
        PageMetas.createModel(docMeta, "textHighlights", callback);
        PageMetas.createModel(docMeta, "areaHighlights", callback);
    }

}
