import {DocMeta} from '../../../metadata/DocMeta';
import {DocMetaModel} from '../../../metadata/DocMetaModel';
import {PageMetas} from '../../../metadata/PageMetas';
import {AnnotationEvent} from '../../../annotations/components/AnnotationEvent';


export class AreaHighlightModel extends DocMetaModel {

    registerListener(docMeta: DocMeta, callback: (componentEvent: AnnotationEvent) => void) {
        PageMetas.createModel(docMeta, "areaHighlights", callback);
    }

}

