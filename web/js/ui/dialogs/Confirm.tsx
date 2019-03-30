import React from 'react';
import {Button} from 'reactstrap';
import {NullCollapse} from '../null_collapse/NullCollapse';
import {Blackout} from '../blackout/Blackout';

class Styles {

    public static title: React.CSSProperties = {
        fontSize: "20px",
        fontWeight: "bold"
    };

    public static subtitle: React.CSSProperties = {
        fontSize: "16px"
    };

    public static button: React.CSSProperties = {
        fontSize: "14px"
    };

}

export class Confirm extends React.PureComponent<ConfirmProps, IState> {

    constructor(props: any) {
        super(props);

        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            open: true
        };

    }

    public render() {

        Blackout.toggle(this.state.open);

        return (

            <NullCollapse open={this.state.open}>

                <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        display: 'flex'
                    }}>

                    <div className="rounded border p-2"
                         style={{
                            margin: 'auto',
                            minHeight: '100px',
                            zIndex: 1000000,
                            backgroundColor: 'var(--white)'
                         }}>

                        <div className="w-100 p-1" style={Styles.title}>
                            {this.props.title}
                        </div>

                        <div className="w-100 p-1 text-muted" style={Styles.subtitle}>
                            {this.props.subtitle || ""}
                        </div>

                        <div className="text-right">
                            <Button color="secondary"
                                    style={Styles.button}
                                    size="sm"
                                    className="m-1"
                                    onClick={() => this.onCancel()}>Cancel</Button>

                            <Button color="danger"
                                    style={Styles.button}
                                    size="sm"
                                    className="m-1"
                                    onClick={() => this.onConfirm()}>Confirm</Button>
                        </div>
                    </div>
                </div>

            </NullCollapse>

        );

    }

    private onConfirm(): void {
        this.setState({open: false});
        Blackout.disable();
        this.props.onConfirm();
    }

    private onCancel(): void {
        this.setState({open: false});
        Blackout.disable();
        this.props.onCancel();
    }


}

export interface ConfirmProps {

    readonly title: string;
    readonly subtitle?: string;
    readonly onCancel: () => void;
    readonly onConfirm: () => void;
    readonly type?: 'danger';

}

export interface IState {
    readonly open: boolean;

}
