import React from 'react';
import {Button} from 'reactstrap';
import {DialogContainer} from './DialogContainer';
import {NullCollapse} from '../null_collapse/NullCollapse';
import {ConfirmProps} from "./Dialogs";

class Styles {

    public static title: React.CSSProperties = {
        fontSize: "20px",
        fontWeight: "bold"
    };

    public static subtitle: React.CSSProperties = {
    };

    public static button: React.CSSProperties = {
        fontWeight: "bold"
    };

}

export class Confirm extends React.PureComponent<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

    }

    public render() {

        const opts = {
            buttonColor: 'primary',
            titlebarClassName: 'bg-dark'
        };

        const {type} = this.props;

        if (type) {
            opts.buttonColor = type;
            opts.titlebarClassName = 'bg-' + type;
        }

        return (

            <DialogContainer open={true}>

                <div onKeyDown={(event) => this.onKeyDown(event)}
                     style={{minWidth: '350px'}}>

                    <div className={"w-100 p-2 " + opts.titlebarClassName}
                         style={Styles.title}>

                        {this.props.title}

                    </div>

                    <div className="w-100 p-1 m-1 text-grey900 text-xl"
                         style={Styles.subtitle}>

                        {this.props.subtitle}

                    </div>

                    <div className="text-right m-1 pb-1">

                        <NullCollapse open={! this.props.noCancel}>

                            <Button color="clear"
                                    style={Styles.button}
                                    size="lg"
                                    className="m-1"
                                    onClick={() => this.onCancel()}>Cancel</Button>

                        </NullCollapse>

                        <Button color={opts.buttonColor}
                                style={Styles.button}
                                size="lg"
                                className="m-1"
                                onClick={() => this.onConfirm()}>Confirm</Button>

                    </div>

                </div>

            </DialogContainer>

        );

    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Escape") {
            this.onCancel();
        }

    }

    private onConfirm(): void {
        this.props.onConfirm();
    }

    private onCancel(): void {

        if (this.props.onCancel) {
            this.props.onCancel();
        }

    }

}

export interface IProps extends ConfirmProps {

}

export interface IState {

}
