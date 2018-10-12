import * as React from 'react';
import {ConfirmButton} from '../../js/ui/confirm/ConfirmButton';
import {TextInputButton} from '../../js/ui/text_input_button/TextInputButton';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';

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

                <TextInputButton id="set-title"
                                 title="Enter new title"
                                 onComplete={(title) => console.log(title)}>

                    Change title

                </TextInputButton>


                {/*<div className="dropdown">*/}
                    {/*<button className="btn btn-secondary dropdown-toggle"*/}
                            {/*type="button" id="dropdownMenuButton"*/}
                            {/*data-toggle="dropdown" aria-haspopup="true"*/}
                            {/*aria-expanded="false">*/}
                        {/*Dropdown button*/}
                    {/*</button>*/}

                    {/*<div className="dropdown-menu"*/}
                         {/*aria-labelledby="dropdownMenuButton">*/}
                        {/*<a className="dropdown-item" href="#">Action</a>*/}
                        {/*<a className="dropdown-item" href="#">Another action</a>*/}
                        {/*<a className="dropdown-item" href="#">Something else*/}
                            {/*here</a>*/}
                    {/*</div>*/}
                {/*</div>*/}
                {/*<div className="btn-group">*/}
                    {/*<button type="button" className="btn btn-danger">Action*/}
                    {/*</button>*/}
                    {/*<button type="button"*/}
                            {/*className="btn btn-danger dropdown-toggle dropdown-toggle-split"*/}
                            {/*data-toggle="dropdown" aria-haspopup="true"*/}
                            {/*aria-expanded="false">*/}
                        {/*<span className="sr-only">Toggle Dropdown</span>*/}
                    {/*</button>*/}
                    {/*<div className="dropdown-menu">*/}
                        {/*<a className="dropdown-item" href="#">Action</a>*/}
                        {/*<a className="dropdown-item" href="#">Another action</a>*/}
                        {/*<a className="dropdown-item" href="#">Something else*/}
                            {/*here</a>*/}
                        {/*<div className="dropdown-divider"></div>*/}
                        {/*<a className="dropdown-item" href="#">Separated link</a>*/}
                    {/*</div>*/}
                {/*</div>*/}


                {/*<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>*/}
                    {/*<DropdownToggle caret>*/}
                        {/*Dropdown*/}
                    {/*</DropdownToggle>*/}
                    {/*<DropdownMenu>*/}
                        {/*<DropdownItem header>Header</DropdownItem>*/}
                        {/*<DropdownItem disabled>Action</DropdownItem>*/}
                        {/*<DropdownItem>Another Action</DropdownItem>*/}
                        {/*<DropdownItem divider />*/}
                        {/*<DropdownItem>Another Action</DropdownItem>*/}
                    {/*</DropdownMenu>*/}
                {/*</Dropdown>*/}

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


