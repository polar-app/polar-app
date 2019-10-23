import * as React from 'react';

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

        this.state = {};

    }

    private onDragOver(event: React.DragEvent<HTMLDivElement>) {
        this.setState({active: true});
        event.preventDefault(); // called to allow the drop.
    }

    private onDragLeave(event: React.DragEvent<HTMLDivElement>) {
        this.setState({active: false});
    }

    private onDrop() {
        this.setState({active: false});
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
}

interface IState {
    readonly active?: boolean;
}


