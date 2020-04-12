import * as React from "react";
import {Debouncers} from "polar-shared/src/util/Debouncers";

export interface AbstractAnnotationRendererProps {
    readonly page: number;
}

export interface AbstractAnnotationRendererState {
    readonly container: HTMLElement | undefined;
}

export abstract class AbstractAnnotationRenderer<P extends AbstractAnnotationRendererProps,
                                                 S extends AbstractAnnotationRendererState>
    extends React.Component<P, AbstractAnnotationRendererState> {

    constructor(props: P, context: any) {
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

        // FIXME: should I use effect?
        // FIXME: remove event listeners on unmount...

        registerScrollListener();
        registerResizeListener();

    }

}
