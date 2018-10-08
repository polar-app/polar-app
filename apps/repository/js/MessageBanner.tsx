import * as React from 'react';
import Alert from 'reactstrap/lib/Alert';

// noinspection TsLint
export class MessageBanner extends React.Component<IProps, IState> {
    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            visible: true
        };

        this.onDismiss = this.onDismiss.bind(this);

    }

    public render() {

        return (

            <div>
                <Alert color="info"
                       isOpen={this.state.visible}
                       toggle={this.onDismiss}
                       fade={false}
                       className="m-1 pl-1 pr-1">
                    <b>Do you like POLAR?</b>  Would you mind <a href="https://github.com/burtonator/polar-bookshelf">giving us a star on <i
                    className="fab fa-github"></i> Github?</a>
                </Alert>

            </div>

        );

    }

    private onDismiss() {
        this.setState({ visible: false });
    }


}

interface IState {
    visible: boolean;
}

export interface IProps {

}
