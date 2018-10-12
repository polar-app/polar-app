import * as React from 'react';
import {ConfirmButton} from '../../js/ui/confirm/ConfirmButton';
import {TextInputButton} from '../../js/ui/text_input_button/TextInputButton';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Popover, PopoverBody} from 'reactstrap';

class App<P> extends React.Component<{}, IAppState> {

    constructor(props: P, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
            deletePopoverOpen: false,
        };
    }

    public render() {
        return (

            <div>

                <ConfirmButton id="confirm"
                               prompt="Are you sure?"
                               onConfirm={() => console.log('confirm')}>

                    Delete

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


                <Dropdown id="dropdown" isOpen={this.state.deletePopoverOpen} toggle={this.toggle}>
                    <DropdownToggle>

                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>Header</DropdownItem>
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>

                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Popover placement={'bottom'}
                         isOpen={this.state.deletePopoverOpen}
                         target="dropdown"
                         toggle={this.toggle}>

                    <PopoverBody>

                        <div className="w-100 text-center lead p-1">
                            this is the prmopt
                        </div>

                        <Button color="secondary"
                                size="sm"
                                className="m-1"
                                >Cancel</Button>

                        <Button color="primary"
                                size="sm"
                                className="m-1"
                                >Confirm</Button>

                    </PopoverBody>

                </Popover>

            </div>
        );

    }

    private toggle() {

        this.setState({
          deletePopoverOpen: !this.state.deletePopoverOpen
        });

    }

}

export default App;

interface IAppState {

    dropdownOpen: boolean;
    deletePopoverOpen: boolean;

}


