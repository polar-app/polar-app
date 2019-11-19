import React from 'react';
import {Button} from 'reactstrap';
import {DialogContainer} from './DialogContainer';
import {NullCollapse} from '../null_collapse/NullCollapse';
import {AlertProps, ConfirmProps} from "./Dialogs";

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

export class Alert extends React.PureComponent<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.onConfirm = this.onConfirm.bind(this);
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

                    <div className={"w-100 p-1 pl-2 pr-2 " + opts.titlebarClassName}
                         style={Styles.title}>

                        {this.props.title}

                    </div>

                    <div className="w-100 p-1 m-1 text-grey900 text-xl"
                         style={Styles.subtitle}>

                        {this.props.body}

                    </div>

                    <div className="text-center m-1 pb-1">

                        <Button color={opts.buttonColor}
                                style={Styles.button}
                                size="lg"
                                className="m-1"
                                onClick={() => this.onConfirm()}>OK</Button>

                    </div>

                </div>

            </DialogContainer>

        );

    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Escape") {
            this.props.onConfirm();
        }

    }

    private onConfirm(): void {
        this.props.onConfirm();
    }


}

export interface IProps extends AlertProps {

}

export interface IState {

}
