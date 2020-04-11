import * as ReactDOM from "react-dom";
import * as React from "react";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {DocFormatFactory} from "../../../../web/js/docformat/DocFormatFactory";
import {IRect} from "polar-shared/src/util/rects/IRect";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IDStr} from "polar-shared/src/util/Strings";
import {Rects} from "../../../../web/js/Rects";
import {
    AbstractAnnotationRenderer,
    AbstractAnnotationRendererProps,
    AbstractAnnotationRendererState
} from "./AbstractAnnotationRenderer";

interface IProps extends AbstractAnnotationRendererProps {
    readonly fingerprint: IDStr;
    readonly textHighlight: ITextHighlight;
    readonly scaleValue: number | undefined;
}

interface IState extends AbstractAnnotationRendererState {
    readonly container: HTMLElement | undefined;
}

export class TextHighlightRenderer extends AbstractAnnotationRenderer<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            container: undefined
        };

    }

    public render() {

        const {container} = this.state;
        const {scaleValue} = this.props;

        if (! container || ! scaleValue) {
            return null;
        }

        const {textHighlight, fingerprint, page} = this.props;

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
                     data-page-num={page}
                    // annotation descriptor metadata - might not be needed
                    // anymore
                     data-annotation-type="text-highlight"
                     data-annotation-id={textHighlight.id}
                     data-annotation-page-num={page}
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

        return Object.values(textHighlight.rects)
                .map(current => toReactPortal(current, container));

    }

}
