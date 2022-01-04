import * as React from "react";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IDStr} from "polar-shared/src/util/Strings";
import {useDocViewerContext} from "../renderers/DocRenderer";
import {memoForwardRef} from "../../../../web/js/react/ReactUtils";
import {TextHighlightRendererStatic} from "./TextHighlightRendererStatic";
import {TextHighlightRendererDynamic} from "./TextHighlightRendererDynamic";
import {PageAnnotation} from "./PageAnnotations";
import {useDocViewerCallbacks} from "../DocViewerStore";
import {IBlockTextHighlight} from "polar-blocks/src/annotations/IBlockTextHighlight";

interface IProps {
    readonly id: string;
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly pageAnnotation: PageAnnotation<ITextHighlight | IBlockTextHighlight>;
    readonly container: HTMLElement,
    readonly type: 'block' | 'docMeta';
}

export const TextHighlightRenderer = memoForwardRef((props: IProps) => {

    const {fileType} = useDocViewerContext();
    const {setActiveHighlight} = useDocViewerCallbacks();

    const handleClick: React.EventHandler<React.MouseEvent> = () => {
        setActiveHighlight({
            highlightID: props.id,
            pageNum: props.pageNum,
        });
    };

    switch (fileType) {

        case "pdf":
            return (
                <TextHighlightRendererStatic onClick={handleClick} {...props}/>
            );
        case "epub":
            return (
                <TextHighlightRendererDynamic onClick={handleClick} {...props}/>
            );

    }

});
