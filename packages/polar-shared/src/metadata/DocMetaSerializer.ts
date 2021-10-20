// import {IDocMeta} from "./IDocMeta";
// import {SparseDocMetas} from "./SparseDocMetas";
// import {Preconditions} from "../Preconditions";
// // import {PageMetas} from "polar-bookshelf/web/js/metadata/PageMetas";
// // import {AnnotationInfos} from "polar-bookshelf/web/js/metadata/AnnotationInfos";
// // import {DocInfos} from "polar-bookshelf/web/js/metadata/DocInfos";
//
export namespace DocMetaSerializer {

    export const ENABLE_SPARSE_DOC_SERIALIZE = true;

    // export function serialize(docMeta: IDocMeta, spacing: string = "  ") {
    //
    //     if (ENABLE_SPARSE_DOC_SERIALIZE) {
    //         const data = SparseDocMetas.toSparse(docMeta);
    //         return JSON.stringify(data, null, spacing);
    //     } else {
    //         return JSON.stringify(docMeta, null, spacing);
    //     }
    //
    // }

//
//     export function deserialize(data: string, fingerprint: string): IDocMeta {
//
//         Preconditions.assertPresent(data, 'data');
//
//         if (typeof data !== "string") {
//             throw new Error("We can only deserialize strings: " + typeof data);
//         }
//
//         const docMeta: IDocMeta = Object.create(DocMeta.prototype);
//
//         try {
//
//             let obj = JSON.parse(data);
//
//             if (SparseDocMetas.isSparse(obj)) {
//                 obj = SparseDocMetas.fromSparse(obj);
//             }
//
//             Object.assign(docMeta, obj);
//
//             if (docMeta.docInfo && !docMeta.docInfo.filename) {
//                 // log.warn("DocMeta has no filename: " + docMeta.docInfo.fingerprint);
//             }
//
//             return DocMetas.upgrade(docMeta);
//
//         } catch (e) {
//             throw Errors.rethrow(e, "Unable to deserialize doc: " + fingerprint);
//         }
//
//     }
//
//     export function upgrade(docMeta: IDocMeta): IDocMeta {
//
//         // validate the JSON data and set defaults. In the future we should
//         // migrate to using something like AJV to provide these defaults and
//         // also perform type assertion.
//
//         docMeta.pageMetas = PageMetas.upgrade(docMeta.pageMetas);
//
//         if (!docMeta.annotationInfo) {
//             // log.debug("No annotation info.. Adding default.");
//             docMeta.annotationInfo = AnnotationInfos.create();
//         }
//
//         if (!docMeta.attachments) {
//             // log.debug("No attachments. Adding empty map.");
//             docMeta.attachments = {};
//         }
//
//         docMeta.docInfo = DocInfos.upgrade(docMeta.docInfo);
//
//         return docMeta;
//
//     }
//
//
}
