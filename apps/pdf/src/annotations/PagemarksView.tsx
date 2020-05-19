import * as React from "react";
import {PageAnnotations} from "./PageAnnotations";
import {PagemarkRenderer2} from "./PagemarkRenderer2";
import {useDocViewerStore} from "../DocViewerStore";

export const PagemarksView = React.memo(() => {

    const {docMeta} = useDocViewerStore();

    if (!docMeta) {
        return null;
    }

    const pageAnnotations = PageAnnotations.compute(docMeta,
                                                    pageMeta => Object.values(pageMeta.pagemarks || {}));

    const renderers = pageAnnotations.map(current =>
                                              <PagemarkRenderer2
                                                  key={current.annotation.id}
                                                  page={current.page}
                                                  fingerprint={docMeta?.docInfo.fingerprint}
                                                  pagemark={current.annotation}/>);

    return (
        <>
            {renderers}
        </>
    )

});

