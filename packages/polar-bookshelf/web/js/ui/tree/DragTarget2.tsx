import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import isEqual from "react-fast-compare";

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
    readonly onDrop: (event: React.DragEvent) => void;
    readonly acceptDrag?: () => boolean;

}

interface IState {
    readonly active: boolean;
}

// TODO: this might be better as a HOC for performance.
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

    public shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>, context: any): boolean {
        return ! isEqual(this.props, nextProps) || ! isEqual(this.state, nextState);
    }

    private acceptDrag(): boolean {

        if (this.props.acceptDrag) {
            return this.props.acceptDrag();
        }

        return true;

    }

    private onDragOver(event: React.DragEvent) {

        if (! this.acceptDrag()) {
            return;
        }

        if (! this.state.active) {
            this.setState({active: true});
        }

        event.preventDefault(); // called to allow the drop.
        event.stopPropagation();
    }

    private onDragLeave(event: React.DragEvent) {

        if (! this.acceptDrag()) {
            return;
        }

        if (this.state.active) {
            this.setState({active: false});
        }

        event.stopPropagation();

    }

    private onDrop(event: React.DragEvent) {

        if (! this.acceptDrag()) {
            return;
        }

        this.setState({active: false});

        this.props.onDrop(event);
    }

    public render() {

        const {active} = this.state;

        return (

            <div onDragOver={(event) => this.onDragOver(event)}
                 onDragLeave={(event) => this.onDragLeave(event)}
                 onDrop={(event) => this.onDrop(event)}>

                <DragContext.Provider value={{active}}>
                    {this.props.children}
                </DragContext.Provider>

            </div>

        );

    }

}
