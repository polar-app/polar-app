import {DocAnnotation, IDocAnnotation} from "./DocAnnotation";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace DocAnnotationSorter {

    export function sort(data: ReadonlyArray<IDocAnnotation>) {

        // TODO: I would prefer that this was a binary tree which was maintained sorted

        const computeScore = (item: IDocAnnotation) => {
            return (item.pageNum * 100000) + (item.position.y * 100) + item.position.x;
        };

        const compareFn = (a: IDocAnnotation, b: IDocAnnotation) => {

            const diff = computeScore(a) - computeScore(b);

            if (diff === 0) {
                return a.id.localeCompare(b.id);
            }

            return diff;

        };

        return arrayStream(data).sort(compareFn).collect();

    }

}
