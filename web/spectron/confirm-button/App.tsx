import * as React from 'react';
import {ConfirmButton} from '../../js/ui/confirm/ConfirmButton';

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
        this.state = {
            dropdownOpen: false,
            splitButtonOpen: false
        };
    }

    public render() {
        return (

            <div>

                <ConfirmButton id="confirm"
                               prompt="Are you sure?"
                               onConfirm={() => console.log('confirml')}>
                    <i className="fa fa-remove doc-button doc-button-active" />
                </ConfirmButton>

            </div>
        );

    }


    private toggleDropDown() {

        this.setState({
            splitButtonOpen: this.state.splitButtonOpen,
            dropdownOpen: !this.state.dropdownOpen
        });

    }

    private toggleSplit() {

        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen
        });

    }



}

export default App;

interface IAppState {
    dropdownOpen: boolean;
    splitButtonOpen: boolean;

}


