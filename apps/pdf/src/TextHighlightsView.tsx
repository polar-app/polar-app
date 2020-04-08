import * as React from "react";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Numbers} from "polar-shared/src/util/Numbers";
import {DocMetas} from "../../../web/js/metadata/DocMetas";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {TextHighlightRenderer} from "./TextHighlightRenderer";

interface IProps {
    readonly docMeta: IDocMeta | undefined;
    readonly scaleValue: number | undefined;
}

export class TextHighlightsView extends React.Component<IProps> {

    // typescript fails to compile this when it's a functional component.
    public render() {

        const {docMeta, scaleValue} = this.props;

        if (!docMeta || ! scaleValue) {
            return null;
        }

        // map these all to page, fingerprint, textHighlight

        const pages = Numbers.range(1, docMeta.docInfo.nrPages);

        interface PageToTextHighlight {
            readonly page: number;
            readonly textHighlight: ITextHighlight;
        }

        const pageToTextHighlights =
            arrayStream(pages)
                .map((page): ReadonlyArray<PageToTextHighlight> => {

                    const pageMeta = DocMetas.getPageMeta(docMeta, page);
                    const textHighlights = Object.values(pageMeta.textHighlights || {});

                    return textHighlights.map(textHighlight => {
                        return {
                            page, textHighlight
                        }
                    });

                })
                .flatMap(current => current)
                .collect();

        return pageToTextHighlights.map(current =>
            <TextHighlightRenderer
                key={current.textHighlight.id}
                page={current.page}
                scaleValue={scaleValue}
                fingerprint={docMeta?.docInfo.fingerprint}
                textHighlight={current.textHighlight}/>
        );

    }
}

