/**
 *
 * Allows us to register events and listen for specific events on a given DocMeta.
 *
 */
import {DocMeta} from './DocMeta';

export abstract class DocMetaModel {

    /**
     *
     * @param docMeta {DocMeta}
     * @param callback
     */
    registerListener(docMeta: DocMeta, callback: any) {

    }

}
