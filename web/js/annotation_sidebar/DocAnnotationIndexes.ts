import {DocAnnotationIndex} from './DocAnnotationIndex';
import {DocAnnotation, DocAnnotationMap, SortedDocAnnotations} from './DocAnnotation';
import {ArrayListMultimap} from "../util/Multimap";

export class DocAnnotationIndexes {
    //
    // public static delete(docAnnotationIndex: DocAnnotationIndex,
    //                      ...ids: string[]): DocAnnotationIndex {
    //
    //     const docAnnotationMap = Object.assign({}, docAnnotationIndex.lookup);
    //
    //     for (const id of ids) {
    //         delete docAnnotationMap[id];
    //     }
    //
    //     const tmpIndex = new DocAnnotationIndex(docAnnotationMap, Object.values(docAnnotationMap));
    //     return this.rebuild(tmpIndex);
    //
    // }
    //
    // public static rebuild(docAnnotationIndex: DocAnnotationIndex,
    //                       ...docAnnotations: DocAnnotation[]): DocAnnotationIndex {
    //
    //     const createDocAnnotationMap = () => {
    //
    //         const docAnnotationMap = {...docAnnotationIndex.lookup};
    //
    //         for (const docAnnotation of docAnnotations) {
    //             docAnnotationMap[docAnnotation.id] = docAnnotation;
    //         }
    //
    //         return docAnnotationMap;
    //
    //     };
    //
    //     const createSortedDocAnnotations = (docAnnotationMap: DocAnnotationMap) => {
    //
    //         // TODO: ideally we would keep this is a sorted set that we just maintain over time.
    //
    //         const docAnnotations = Object.values(docAnnotationMap);
    //
    //         // now sort the doc annotations so that they're in the order we need them.
    //         const sortedDocAnnotations = docAnnotations.sort((a, b) => {
    //
    //             const diff = this.computeScore(a) - this.computeScore(b);
    //
    //             if (diff === 0) {
    //                 return a.id.localeCompare(b.id);
    //             }
    //
    //             return diff;
    //
    //         });
    //
    //         return sortedDocAnnotations;
    //
    //     };
    //
    //     const docAnnotationMap = createDocAnnotationMap();
    //     const sortedDocAnnotations = createSortedDocAnnotations(docAnnotationMap);
    //
    //     return new DocAnnotationIndex(docAnnotationMap, sortedDocAnnotations);
    //
    // }
    //
    // public static computeScore(item: DocAnnotation) {
    //
    //     return (item.pageNum * 100000) + (item.position.y * 100) + item.position.x;
    //
    // }

}
