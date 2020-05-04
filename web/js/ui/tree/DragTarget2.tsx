import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IDragContext {
    readonly active: boolean;
}

export const DragContext = React.createContext<IDragContext>({active: false});

export function useDragContext() {
    return React.useContext(DragContext);
}

interface IProps {

    /**
     * Function to call when a drag has finished.
     */
    readonly onDrop: () => void;
    readonly acceptDrag?: () => boolean;

}

interface IState {
    readonly active: boolean;
}

export class DragTarget2 extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.acceptDrag = this.acceptDrag.bind(this);

        this.state = {
            active: false
        };

    }

    private acceptDrag(): boolean {

        if (this.props.acceptDrag) {
            return this.props.acceptDrag();
        }

        return true;

    }

    private onDragOver(event: React.DragEvent<HTMLDivElement>) {

        if (! this.acceptDrag()) {
            return;
        }

        if (! this.state.active) {
            this.setState({active: true});
        }

        event.preventDefault(); // called to allow the drop.
    }

    private onDragLeave(event: React.DragEvent<HTMLDivElement>) {

        if (! this.acceptDrag()) {
            return;
        }

        if (this.state.active) {
            this.setState({active: false});
        }

    }

    private onDrop() {

        if (! this.acceptDrag()) {
            return;
        }

        this.setState({active: false});

        this.props.onDrop();
    }

    public render() {

        const {active} = this.state;

        return (

            <div onDragOver={(event) => this.onDragOver(event)}
                 onDragLeave={(event) => this.onDragLeave(event)}
                 onDrop={() => this.onDrop()}>

                <DragContext.Provider value={{active}}>
                    {this.props.children}
                </DragContext.Provider>

            </div>

        );

    }


}
