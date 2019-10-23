import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

class Styles {

    public static DROP_ACTIVE: React.CSSProperties = {
        backgroundColor: 'var(--grey100)',
        borderColor: 'var(--primary)',
        borderWidth: '1px',
        borderStyle: 'solid'
    };

    public static DROP_INACTIVE: React.CSSProperties = {
        borderColor: 'var(--white)',
        borderWidth: '1px',
        borderStyle: 'solid'
    };

}

export class DragTarget extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.acceptDrag = this.acceptDrag.bind(this);

        this.state = {};

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

        this.setState({active: true});
        event.preventDefault(); // called to allow the drop.
    }

    private onDragLeave(event: React.DragEvent<HTMLDivElement>) {

        if (! this.acceptDrag()) {
            return;
        }

        this.setState({active: false});

    }

    private onDrop() {

        if (! this.acceptDrag()) {
            return;
        }

        this.setState({active: false});

        const onDropped = this.props.onDropped || NULL_FUNCTION;

        onDropped();
    }

    public render() {

        const {active} = this.state;

        return (

            <div style={active ? Styles.DROP_ACTIVE : Styles.DROP_INACTIVE}
                 onDragOver={(event) => this.onDragOver(event)}
                 onDragLeave={(event) => this.onDragLeave(event)}
                 onDrop={() => this.onDrop()}>

                {this.props.children}

            </div>

        );

    }


}

interface IProps {

    /**
     * Function to call when a drag has finished.
     */
    readonly onDropped?: () => void;

    readonly acceptDrag?: () => boolean;

}

interface IState {
    readonly active?: boolean;
}


