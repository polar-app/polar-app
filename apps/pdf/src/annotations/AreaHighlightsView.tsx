import * as React from "react";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {PageAnnotations} from "./PageAnnotations";
import {AreaHighlightRenderer2} from "./AreaHighlightRenderer2";

interface IProps {
    readonly docMeta: IDocMeta | undefined;
    readonly scaleValue: number | undefined;
}

export class AreaHighlightsView extends React.Component<IProps> {

    // typescript fails to compile this when it's a functional component.
    public render() {

        const {docMeta, scaleValue} = this.props;

        if (!docMeta || ! scaleValue) {
            return null;
        }

        const pageAnnotations = PageAnnotations.compute(docMeta,
                                                        pageMeta => Object.values(pageMeta.areaHighlights || {}));

        return pageAnnotations.map(current =>
            <AreaHighlightRenderer2
                key={current.annotation.id}
                page={current.page}
                scaleValue={scaleValue}
                fingerprint={docMeta?.docInfo.fingerprint}
                areaHighlight={current.annotation}/>
        );

    }
}

