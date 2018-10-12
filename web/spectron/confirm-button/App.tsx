import * as React from 'react';
import {ConfirmButton} from '../../js/ui/confirm/ConfirmButton';
import {TextInputButton} from '../../js/ui/text_input_button/TextInputButton';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Popover, PopoverBody} from 'reactstrap';

class App<P> extends React.Component<{}, IAppState> {

    private open: boolean = false;
    private selected: SelectedOption = 'none';

    constructor(props: P, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);

        this.state = {
            open: this.open,
            selected: this.selected
        };

    }


    public render() {

        console.log("this.state.selected: " , this.state);

        return (

            <div className="text-right">

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


                <Dropdown id="dropdown" isOpen={this.state.open} toggle={this.toggle}>
                    <DropdownToggle id="dropdown-toggle">
                         asdf
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => this.select('delete')}>
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Popover placement="bottom"
                         isOpen={this.state.selected === 'delete'}
                         target="dropdown-toggle">

                    <PopoverBody>

                        <div className="w-100 text-center lead p-1">
                            Are you sure you want to delete?
                        </div>

                        <Button color="secondary"
                                size="sm"
                                className="m-1">
                            Cancel
                        </Button>

                        <Button color="primary"
                                size="sm"
                                className="m-1">
                            Confirm
                        </Button>

                    </PopoverBody>

                </Popover>

            </div>
        );

    }


    private toggle() {

        console.log("toggle()")

        this.open = ! this.state.open;

        this.setState({
            open: this.open,
            selected: this.selected
        });

    }

    private select(selected: SelectedOption) {

        console.log("select()")

        console.log("Goign to set selected: " + selected)

        this.selected = selected;

        this.setState({
            open: this.open,
            selected: this.selected
        });

    }

}

export default App;

interface IAppState {

    open: boolean;
    selected: SelectedOption;

}

type SelectedOption = 'set-title' | 'delete' | 'none';

