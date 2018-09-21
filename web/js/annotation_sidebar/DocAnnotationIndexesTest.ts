import {DocAnnotation, DocAnnotationMap} from './DocAnnotation';
import {AnnotationType} from '../metadata/AnnotationType';
import {Arrays} from '../util/Arrays';
import {DocAnnotationIndexes} from './DocAnnotationIndexes';

describe('DocAnnotationIndexes', function() {

    it("Basic sorting", function() {

        const a0: DocAnnotation = createAnnotation('0001', 1, 0, 0 );
        const a1: DocAnnotation = createAnnotation('0002', 1, 0, 0 );
        const a2: DocAnnotation = createAnnotation('0003', 1, 0, 0 );

        const docAnnotationMap = createIndex(a0, a1);

        DocAnnotationIndexes.rebuild(docAnnotationMap, a2);

    });

});

function createAnnotation(id: string,
                          pageNum: number,
                          x: number,
                          y: number): DocAnnotation {

    return {
        id,
        annotationType: AnnotationType.TEXT_HIGHLIGHT,
        pageNum,
        position: {
            x,
            y
        }
    };

}

function createIndex(...docAnnotations: DocAnnotation[]) {

    const result: DocAnnotationMap = {};

    docAnnotations = Arrays.shuffle(...docAnnotations);

    for (const docAnnotation of docAnnotations) {
        result[docAnnotation.id] = docAnnotation;
    }

    return result;

}
