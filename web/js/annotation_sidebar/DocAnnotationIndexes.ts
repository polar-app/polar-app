import {DocAnnotationIndex} from './DocAnnotationIndex';
import {DocAnnotation, SortedDocAnnotations} from './DocAnnotation';

export class DocAnnotationIndexes {

    public static delete(docAnnotationIndex: DocAnnotationIndex,
                         ...ids: string[]): DocAnnotationIndex {

        const docAnnotationMap = Object.assign({}, docAnnotationIndex.docAnnotationMap);

        for (const id of ids) {
            delete docAnnotationMap[id];
        }

        // FIXME: comments vanish when the index is rebuilt...

        const tmpIndex = new DocAnnotationIndex(docAnnotationMap, Object.values(docAnnotationMap));
        return this.rebuild(tmpIndex);

    }

    public static rebuild(docAnnotationIndex: DocAnnotationIndex,
                          ...docAnnotations: DocAnnotation[]): DocAnnotationIndex {

        const docAnnotationMap = Object.assign({}, docAnnotationIndex.docAnnotationMap);
        let sortedDocAnnotations: SortedDocAnnotations = [];

        for (const docAnnotation of docAnnotations) {
            docAnnotationMap[docAnnotation.id] = docAnnotation;
        }

        sortedDocAnnotations.push(...Object.values(docAnnotationMap));

        // now sort the doc annotations so that they're in the order we need them.
        sortedDocAnnotations = sortedDocAnnotations.sort((a, b) => {

            const diff = this.computeScore(a) - this.computeScore(b);

            if (diff === 0) {
                return a.id.localeCompare(b.id);
            }

            return diff;

        });

        return new DocAnnotationIndex(docAnnotationMap, sortedDocAnnotations);

    }

    public static computeScore(item: DocAnnotation) {

        // FIXME: this won't work and I don't have an elegant solution to it yet.
        // the text highlights and area highlights are on different coordinate
        // systems.  The text highlights are pixel offsets and area highlights
        // are percentage offsets.

        // FIXME: a solution here is to add a NEW position system based on
        // pixel offset (position) of where it's recorded when it's created like
        // we do with text highlights.

        return (item.pageNum * 100000) + (item.position.y * 100) + item.position.x;

    }

}
