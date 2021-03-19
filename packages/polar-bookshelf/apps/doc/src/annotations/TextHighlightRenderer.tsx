import * as React from "react";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IDStr} from "polar-shared/src/util/Strings";
import {useDocViewerContext} from "../renderers/DocRenderer";
import {memoForwardRef} from "../../../../web/js/react/ReactUtils";
import {TextHighlightRendererStatic} from "./TextHighlightRendererStatic";
import {TextHighlightRendererDynamic} from "./TextHighlightRendererDynamic";
import {PageAnnotation} from "./PageAnnotations";

interface IProps {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly pageAnnotation: PageAnnotation<ITextHighlight>;
    readonly container: HTMLElement,
}

export const TextHighlightRenderer = memoForwardRef((props: IProps) => {

    const {fileType} = useDocViewerContext();

    switch (fileType) {

        case "pdf":
            return (
                <TextHighlightRendererStatic {...props}/>
            );
        case "epub":
            return (
                <TextHighlightRendererDynamic {...props}/>
            );

    }

});
