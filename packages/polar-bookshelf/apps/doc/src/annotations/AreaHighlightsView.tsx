import * as React from "react";
import {PageAnnotations} from "./PageAnnotations";
import {AreaHighlightRenderer2} from "./AreaHighlightRenderer2";
import {useDocViewerStore} from "../DocViewerStore";

export const AreaHighlightsView = React.memo(() => {

    const {docMeta} = useDocViewerStore();

    if (!docMeta) {
        return null;
    }

    const pageAnnotations = PageAnnotations.compute(docMeta,
                                                    pageMeta => Object.values(pageMeta.areaHighlights || {}));

    const rendered = pageAnnotations.map(current =>
                                             <AreaHighlightRenderer2
                                                 key={current.annotation.id}
                                                 pageNum={current.pageNum}
                                                 fingerprint={docMeta?.docInfo.fingerprint}
                                                 areaHighlight={current.annotation}/>);

    return (
        <>
            {rendered}
        </>
    );

});

