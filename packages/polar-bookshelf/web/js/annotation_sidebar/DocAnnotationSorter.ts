import {IDocAnnotationRef} from "./DocAnnotation";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace DocAnnotationSorter {

    export function sort<D extends IDocAnnotationRef>(data: ReadonlyArray<D>) {

        // TODO: I would prefer that this was a binary tree which was maintained sorted

        const computeScore = (item: D) => {
            return (item.pageNum * 100000) + (item.position.y * 100) + item.position.x;
        };

        const compareFn = (a: D, b: D) => {

            const diff = computeScore(a) - computeScore(b);

            if (diff === 0) {
                return a.id.localeCompare(b.id);
            }

            return diff;

        };

        return arrayStream(data).sort(compareFn).collect();

    }

}
