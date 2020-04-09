import {DocAnnotation} from "./DocAnnotation";
import {DocAnnotationIndex} from "./DocAnnotationIndex";
import {DocAnnotations} from "./DocAnnotations";
import {DocFileResolver} from "../datastore/DocFileResolvers";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {ArrayStreams} from "polar-shared/src/util/ArrayStreams";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";

/**
 * Handles updating the DocAnnotationIndex when we receive new updates to DocMeta.
 */
export class DocAnnotationLoader {

    private registering: boolean = false;

    constructor(private docFileResolver: DocFileResolver) {

    }

    public load(docMeta: IDocMeta): ReadonlyArray<DocAnnotation> {

        const {docFileResolver} = this;

        this.registering = true;

        const docAnnotationIndex = new DocAnnotationIndex();

        const createAreaHighlightConverter = (pageMeta: IPageMeta) => (annotation: IAreaHighlight) => {
            return DocAnnotations.createFromAreaHighlight(docFileResolver, docMeta, annotation, pageMeta);
        };

        const createTextHighlightConverter = (pageMeta: IPageMeta) => (annotation: ITextHighlight) => {
            return DocAnnotations.createFromTextHighlight(docMeta, annotation, pageMeta);
        };

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            const areaHighlightConverter = createAreaHighlightConverter(pageMeta);
            const textHighlightConverter = createTextHighlightConverter(pageMeta);

            ArrayStreams.ofMapValues(pageMeta.areaHighlights)
                        .map(current => areaHighlightConverter(current))
                        .transferTo(values => docAnnotationIndex.put(...values));

            ArrayStreams.ofMapValues(pageMeta.textHighlights)
                .map(current => textHighlightConverter(current))
                .transferTo(values => docAnnotationIndex.put(...values));

        }

        return docAnnotationIndex.getDocAnnotations();

    }

}
