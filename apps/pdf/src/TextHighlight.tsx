import * as ReactDOM from "react-dom";
import * as React from "react";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";

interface IProps {
    // readonly page: number;
    // readonly pagemark: IPagemark;
}

interface IState {
    readonly container: HTMLElement | undefined;
}

export class TextHighlight extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            container: undefined
        };

    }

    public componentDidMount(): void {

        const doUpdate = () => {

            const getContainer = (): HTMLElement | undefined => {

                const pageElement = document.querySelector(".page[data-page-number='14']");

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

        const viewerContainer = document.getElementById('viewerContainer');

        const debouncer = Debouncers.create(() => doUpdate());

        // FIXME: resize listeners too... and make this a pure component???

        viewerContainer!.addEventListener('scroll', () => debouncer());

    }

    // FIXME: remove event listeners on unmount...

    public render() {

        if (! this.state.container) {
            return null;
        }

        return ReactDOM.createPortal(
            <div style={{
                position: 'absolute',
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                top: '100px',
                left: '100px',
                width: '100px',
                height: '100px'
            }}/>,
            this.state.container);

    }

}
