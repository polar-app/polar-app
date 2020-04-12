import * as React from "react";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {TextHighlightRenderer} from "./TextHighlightRenderer";
import {PageAnnotations} from "./PageAnnotations";

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

        const pageAnnotations = PageAnnotations.compute(docMeta,
                                                        pageMeta => Object.values(pageMeta.textHighlights || {}));

        return pageAnnotations.map(current =>
            <TextHighlightRenderer
                key={current.annotation.id}
                page={current.page}
                scaleValue={scaleValue}
                fingerprint={docMeta?.docInfo.fingerprint}
                textHighlight={current.annotation}/>
        );

    }
}

