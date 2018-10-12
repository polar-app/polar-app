import * as React from 'react';
import {ConfirmButton} from '../../js/ui/confirm/ConfirmButton';
import {TextInputButton} from '../../js/ui/text_input_button/TextInputButton';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Popover, PopoverBody} from 'reactstrap';

export class CustomDropdown extends React.Component<IProps, IState> {

    private open: boolean = false;
    private selected: SelectedOption = 'none';

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.select = this.select.bind(this);

        this.state = {
            open: this.open,
            selected: this.selected
        };

    }


    public render() {

        return (

            <div className="text-right">

                <Dropdown id={this.props.id} isOpen={this.state.open} toggle={this.toggle}>
                    <DropdownToggle id={this.props.id + '-dropdown-toggle'}>
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
                         target={this.props.id + '-dropdown-toggle'}>

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

        console.log("select()");

        console.log("Goign to set selected: " + selected);

        this.selected = selected;

        this.setState({
            open: this.open,
            selected: this.selected
        });

    }

}

interface IProps {
    id: string;
}

interface IState {

    open: boolean;
    selected: SelectedOption;

}

type SelectedOption = 'set-title' | 'delete' | 'none';

