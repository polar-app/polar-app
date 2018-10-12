import * as React from 'react';
import Alert from 'reactstrap/lib/Alert';
import {Arrays} from '../../../web/js/util/Arrays';

// <i className="fab fa-github"></i>

// noinspection TsLint
export class MessageBanner extends React.Component<IProps, IState> {

    private message?: JSX.Element;

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

                    {this.message!}

                </Alert>

            </div>

        );

    }


    public componentWillMount(): void {

        this.message = Arrays.shuffle(...MESSAGES)[0];

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


// noinspection TsLint
const MESSAGES = [

    <div><b>Do you like POLAR?</b> Would you mind <a href="https://github.com/burtonator/polar-bookshelf">giving us a star on Github?</a></div>,

    <div>Can you help other people discover POLAR by <a href="https://alternativeto.net/software/polar-1/">voting for us on alternativeTo?</a></div>

];

