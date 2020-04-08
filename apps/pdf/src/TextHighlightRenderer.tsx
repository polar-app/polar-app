import * as ReactDOM from "react-dom";
import * as React from "react";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {DocFormatFactory} from "../../../web/js/docformat/DocFormatFactory";
import {IRect} from "polar-shared/src/util/rects/IRect";
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {IDStr} from "polar-shared/src/util/Strings";
import {Rects} from "../../../web/js/Rects";

interface IProps {
    readonly page: number;
    readonly fingerprint: IDStr;
    readonly textHighlight: ITextHighlight;
    readonly scaleValue: number | undefined;
}

interface IState {
    readonly container: HTMLElement | undefined;
}

export class TextHighlightRenderer extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            container: undefined
        };

    }

    public componentDidMount(): void {

        const {page} = this.props;

        // update and get the container...
        const doUpdate = () => {

            const getContainer = (): HTMLElement | undefined => {

                const pageElement = document.querySelector(`.page[data-page-number='${page}']`);

                if (! pageElement) {
                    return undefined;
                }

                const textLayerElement = pageElement.querySelector(".textLayer");

                if (! textLayerElement) {
                    return undefined;
                }

                return textLayerElement as HTMLElement;

            };

            const container = getContainer();

            if (this.state.container !== container) {
                this.setState({container});
            }

        };

        doUpdate();

        const doUpdateDebouncer = Debouncers.create(() => doUpdate());

        const registerScrollListener = () => {
            const viewerContainer = document.getElementById('viewerContainer');
            viewerContainer!.addEventListener('scroll', () => doUpdateDebouncer());
        };

        const registerResizeListener = () => {
            window.addEventListener('resize', () => doUpdateDebouncer());
        };

        // FIXME this can not be a pure component becaomse it depends on the scroll
        // FIXME: should I use effect?

        registerScrollListener();
        registerResizeListener();

    }

    // FIXME: remove event listeners on unmount...

    public render() {

        const {container} = this.state;
        const {scaleValue} = this.props;

        if (! container || ! scaleValue) {
            return null;
        }

        const {textHighlight, fingerprint, page} = this.props;

        // FIXME: remove this...
        const docFormat = DocFormatFactory.getInstance();

        const createScaledRect = (textHighlightRect: IRect): IRect => {

            // FIXME: ditch this as we need a way to get the current scale
            // when viewing the PDF...

            if (docFormat.name === "pdf") {

                // this is only needed for PDF and we might be able to use a transform
                // in the future which would be easier.
                return Rects.scale(textHighlightRect, scaleValue);
            }

            return textHighlightRect;

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
