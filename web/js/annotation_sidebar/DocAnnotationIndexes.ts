import {DocAnnotationIndex} from './DocAnnotationIndex';
import {DocAnnotation, SortedDocAnnotations} from './DocAnnotation';

export class DocAnnotationIndexes {

    public static rebuild(docAnnotationIndex: DocAnnotationIndex,
                          ...docAnnotations: DocAnnotation[]): DocAnnotationIndex {

        const docAnnotationMap = Object.assign({}, docAnnotationIndex.docAnnotationMap);
        const sortedDocAnnotations: SortedDocAnnotations = [];

        const result = new DocAnnotationIndex(docAnnotationMap, []);

        for (const docAnnotation of docAnnotations) {
            docAnnotationMap[docAnnotation.id] = docAnnotation;
        }

        sortedDocAnnotations.push(...Object.values(docAnnotationMap));

        function sortScore(item: DocAnnotation) {
            return item.pageNum * item.position.x * item.position.y;
        }

        // now sort the doc annotations so that they're in the order we need them.
        sortedDocAnnotations.sort((a, b) => sortScore(a) - sortScore(b));

        return result;

    }

}
