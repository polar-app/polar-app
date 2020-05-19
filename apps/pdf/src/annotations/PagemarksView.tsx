import * as React from "react";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {PageAnnotations} from "./PageAnnotations";
import {PagemarkRenderer2} from "./PagemarkRenderer2";

interface IProps {
    readonly docMeta: IDocMeta | undefined;
    readonly scaleValue: number | undefined;
}

export const PagemarksView = React.memo((props: IProps) => {

    const {docMeta, scaleValue} = props;

    if (!docMeta || !scaleValue) {
        return null;
    }

    const pageAnnotations = PageAnnotations.compute(docMeta,
                                                    pageMeta => Object.values(pageMeta.pagemarks || {}));

    const renderers = pageAnnotations.map(current =>
                                              <PagemarkRenderer2
                                                  key={current.annotation.id}
                                                  page={current.page}
                                                  scaleValue={scaleValue}
                                                  fingerprint={docMeta?.docInfo.fingerprint}
                                                  pagemark={current.annotation}/>);

    return (
        <>
            {renderers}
        </>
    )

});

