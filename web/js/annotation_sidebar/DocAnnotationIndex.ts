import {
    DefaultDocAnnotation,
    DocAnnotation,
    DocAnnotationMap,
    IDocAnnotation,
    SortedDocAnnotations
} from './DocAnnotation';
import {ArrayListMultimap} from "../util/Multimap";
import {Optional} from "../util/ts/Optional";
import {Refs} from "../metadata/Refs";

export class DocAnnotationIndex {

    private readonly lookup: DocAnnotationMap = {};
    private readonly children = new ArrayListMultimap<string, DocAnnotation>();

    constructor(docAnnotationMap: DocAnnotationMap = {}) {
        this.lookup = docAnnotationMap;
    }

    public get(id: IDString): DocAnnotation | undefined {
        return Optional.of(this.lookup[id]).getOrUndefined();
    }

    public put(...docAnnotations: ReadonlyArray<IDocAnnotation>) {

        for (const docAnnotation of docAnnotations) {

            const entry = new DefaultDocAnnotation(this, docAnnotation);

            if (docAnnotation.ref) {
                const parsedRef = Refs.parse(docAnnotation.ref);
                this.addChild(parsedRef.value, entry);
            } else {
                this.lookup[docAnnotation.id] = entry;
            }

        }

    }

    public delete(id: IDString) {

        const current = this.get(id);

        if (current && current.ref) {
            this.removeChild(current.ref, current.id);
        }

        delete this.lookup[id];
        this.children.delete(id);

    }

    public getDocAnnotations(): ReadonlyArray<DefaultDocAnnotation> {
        return Object.values(this.lookup);
    }

    public getDocAnnotationsSorted(): ReadonlyArray<DefaultDocAnnotation> {

        const computeScore = (item: DocAnnotation) => {
            return (item.pageNum * 100000) + (item.position.y * 100) + item.position.x;
        };

        // TODO: I would prefer that this was a binary tree which was maintained sorted

        return Object.values(this.lookup)
            .sort((a, b) => {

                const diff = computeScore(a) - computeScore(b);

                if (diff === 0) {
                    return a.id.localeCompare(b.id);
                }

                return diff;

            });

    }

    // FIXME make private
    public getChildren(id: IDString): ReadonlyArray<DocAnnotation> {
        return this.children.get(id);
    }

    // FIXME make private
    public setChildren(id: IDString, children: ReadonlyArray<DocAnnotation>): void {
        this.children.putAll(id, children);
    }

    // FIXME make private
    public addChild(id: IDString, docAnnotation: DocAnnotation) {
        this.children.put(id, docAnnotation);

        // this.children.push(docAnnotation);
        // this.children.sort((c0, c1) => -c0.created.localeCompare(c1.created));
    }

    // FIXME make private
    public removeChild(id: IDString, child: IDString) {
        this.children.delete(id, undefined, (value: DocAnnotation) => value.id === child);
    }
}

export type IDString = string;
