import * as ReactDOM from "react-dom";
import * as React from "react";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IRect} from "polar-shared/src/util/rects/IRect";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IDStr} from "polar-shared/src/util/Strings";
import {Rects} from "../../../../web/js/Rects";
import {useAnnotationContainer} from "./AnnotationHooks";
import isEqual from "react-fast-compare";
import {useDocViewerStore} from "../DocViewerStore";

interface IProps {
    readonly fingerprint: IDStr;
    readonly pageNum: number;
    readonly textHighlight: ITextHighlight;
}

export const TextHighlightRenderer2 = React.memo((props: IProps) => {

    const {textHighlight, fingerprint, pageNum} = props;

    const container = useAnnotationContainer(pageNum);
    const {docScale} = useDocViewerStore();

    if (! container || ! docScale) {
        return null;
    }

    const {scaleValue} = docScale;

    const createScaledRect = (textHighlightRect: IRect): IRect => {

        // this is only needed for PDF and we might be able to use a
        // transform in the future which would be easier.  For all other
        // document formats the scale should just be '1'
        return Rects.scale(textHighlightRect, scaleValue);

    };

    const toReactPortal = (rawTextHighlightRect: IRect, container: HTMLElement) => {

        const className = `text-highlight annotation text-highlight-${textHighlight.id}`;
        const textHighlightRect = createScaledRect(rawTextHighlightRect);

        const color: HighlightColor = textHighlight.color || 'yellow';

        const backgroundColor = HighlightColors.toBackgroundColor(color, 0.5);

        return ReactDOM.createPortal(
            <div data-type="text-highlight"
                 data-doc-fingerprint={fingerprint}
                 data-text-highlight-id={textHighlight.id}
                 data-page-num={pageNum}
                // annotation descriptor metadata - might not be needed
                // anymore
                 data-annotation-type="text-highlight"
                 data-annotation-id={textHighlight.id}
                 data-annotation-page-num={pageNum}
                 data-annotation-doc-fingerprint={fingerprint}
                 data-annotation-color={color}
                 className={className}
                 style={{
                     position: 'absolute',
                     backgroundColor,
                     left: `${textHighlightRect.left}px`,
                     top: `${textHighlightRect.top}px`,
                     width: `${textHighlightRect.width}px`,
                     height: `${textHighlightRect.height}px`,
                     mixBlendMode: 'multiply'
                 }}/>,
            container);
    };

    const portals = Object.values(textHighlight.rects)
                          .map(current => toReactPortal(current, container));

    return (
        <>
            {portals}
        </>
    );

}, isEqual);
