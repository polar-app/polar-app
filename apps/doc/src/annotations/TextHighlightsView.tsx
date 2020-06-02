import * as React from "react";
import {PageAnnotations} from "./PageAnnotations";
import {TextHighlightRenderer2} from "./TextHighlightRenderer2";
import isEqual from "react-fast-compare";
import {useDocViewerStore} from "../DocViewerStore";

export const TextHighlightsView = React.memo(() => {

    const {docMeta} = useDocViewerStore();

    if (!docMeta) {
        return null;
    }

    const pageAnnotations = PageAnnotations.compute(docMeta,
                                                    pageMeta => Object.values(pageMeta.textHighlights || {}));

    const rendered = pageAnnotations.map(current =>
                                             <TextHighlightRenderer2
                                                 key={current.annotation.id}
                                                 pageNum={current.pageNum}
                                                 fingerprint={docMeta?.docInfo.fingerprint}
                                                 textHighlight={current.annotation}/>);

    return (
        <>
            {rendered}
        </>
    );

}, isEqual);

