import React from 'react';
import Button from 'reactstrap/lib/Button';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Popover} from 'reactstrap';
import {NullCollapse} from '../null_collapse/NullCollapse';

class Styles {

}

export class NotificationButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            open: false,
            count: 0
        };

    }

    public render() {

        return (

            <div className="">

                <Button color="primary"
                        id="notification-button"
                        size="sm"
                        onClick={() => this.toggle(true)}
                        style={{fontSize: '15px'}}
                        className="">

                        <span className="fa-layers fa-fw">

                            <i className="fas fa-envelope"></i>

                            <NullCollapse open={this.state.count > 0}>

                                &nbsp {this.state.count}

                            </NullCollapse>

                        </span>

                </Button>

                <Popover trigger="legacy"
                         placement="bottom"
                         isOpen={this.state.open}
                         toggle={() => this.toggle(false)}
                         target="notification-button"
                         className=""
                         style={{maxWidth: '600px'}}>

                    <PopoverBody className="shadow">


                        .. this is the boty...

                    </PopoverBody>

                </Popover>

            </div>

        );

    }

    private toggle(open: boolean) {
        this.setState({...this.state, open});
    }

}

interface IProps {

}

interface IState {
    readonly count: number;
    readonly open: boolean;
}



